#!/usr/bin/env python3
"""Read-only subset checks for EX200 training. Never executes user-supplied code."""
import argparse
import datetime
import glob
import grp
import hashlib
import json
import os
from pathlib import Path
import pwd
import re
import shutil
import stat
import subprocess
import tarfile

AUTO = {'files': [0, 1], 'ssh': [1], 'rpm': [0], 'journal': [0],
        'lvm': [0], 'permissions': [0], 'schedule': [0], 'services': [0],
        'users': [0, 1], 'selinux': [0]}
MACHINE = {k: 'server' for k in AUTO}
MACHINE['ssh'] = 'client'

# BEGIN EXAM ALIASES
EXAM_ALIASES = json.loads("{\"examregex\":{\"lab\":\"files\",\"map\":{\"0\":0}},\"examssh\":{\"lab\":\"ssh\",\"map\":{\"1\":1}},\"examrpm\":{\"lab\":\"rpm\",\"map\":{\"0\":0}},\"examjournal\":{\"lab\":\"journal\",\"map\":{\"0\":0}},\"examgrow\":{\"lab\":\"lvm\",\"map\":{\"0\":0}},\"examperms\":{\"lab\":\"permissions\",\"map\":{\"0\":0}},\"examscheduler\":{\"lab\":\"schedule\",\"map\":{\"0\":0}},\"examusers\":{\"lab\":\"users\",\"map\":{\"0\":0,\"1\":1}},\"examsecontext\":{\"lab\":\"selinux\",\"map\":{\"0\":0}}}")
for alias, definition in EXAM_ALIASES.items():
    AUTO[alias] = [int(i) for i in definition['map']]
    MACHINE[alias] = MACHINE[definition['lab']]
# END EXAM ALIASES



































def cmd(*args):
    p = subprocess.run(args, text=True, capture_output=True, timeout=15, check=False)
    return p.returncode == 0, p.stdout.strip()

def read(path):
    return Path(path).read_text()

def digest(path):
    with open(path, 'rb') as f:
        return hashlib.file_digest(f, 'sha256').hexdigest() if hasattr(hashlib, 'file_digest') else hashlib.sha256(f.read()).hexdigest()

def verify(lab, criterion):
    if lab in EXAM_ALIASES:
        definition = EXAM_ALIASES[lab]
        return verify(definition['lab'], definition['map'][str(criterion)])
    if lab == 'files':
        root = Path('/srv/ex200/expediente')
        output = root / 'errores.txt'
        if criterion == 0:
            expected = ''.join(line for line in read('/opt/ex200/access.log').splitlines(keepends=True) if 'ERROR' in line)
            return read(output) == expected
        archive = root / 'errores.tar.gz'
        with tarfile.open(archive, 'r:gz') as t:
            members = [m for m in t.getmembers() if m.isfile() and Path(m.name).name == 'errores.txt']
            packed = bool(members) and t.extractfile(members[0]).read() == output.read_bytes()
        sym = root / 'errores-link.txt'
        hard = root / 'errores-hard.txt'
        return bool(packed and sym.is_symlink() and sym.resolve() == output.resolve()
                    and not hard.is_symlink() and os.path.samefile(output, hard))
    if lab == 'ssh':
        return digest('/home/vagrant/evidencia.log') == digest('/opt/ex200/access.log')
    if lab == 'rpm':
        return cmd('rpm', '-q', 'tree')[0] and shutil.which('tree') is not None
    if lab == 'journal':
        # Files in the system journal's persistent directory demonstrate actual disk use.
        return any(Path(p).stat().st_size > 0 for p in glob.glob('/var/log/journal/*/system*.journal'))
    if lab == 'lvm':
        ok, out = cmd('lvs', '--reportformat', 'json', '--units', 'b', '--nosuffix', '-o', 'vg_name,lv_name,lv_size')
        if not ok:
            return False
        volumes = json.loads(out)['report'][0]['lv']
        lv = any(v['vg_name'] == 'vg_lab' and v['lv_name'] == 'datos' and float(v['lv_size']) >= 1073741824 for v in volumes)
        ok, fs = cmd('findmnt', '--mountpoint', '/srv/ex200/lvm', '-n', '-o', 'FSTYPE,SOURCE')
        return bool(lv and ok and fs.split()[0] == 'xfs' and
                    os.path.realpath(fs.split()[1]) == os.path.realpath('/dev/vg_lab/datos'))
    if lab == 'permissions':
        s = Path('/srv/ex200/equipo').stat()
        return stat.S_ISDIR(s.st_mode) and s.st_gid == grp.getgrnam('operaciones').gr_gid and bool(s.st_mode & stat.S_ISGID)
    if lab == 'schedule':
        return cmd('systemctl', 'is-active', '--quiet', 'ex200-heartbeat.timer')[0] and cmd('systemctl', 'is-enabled', '--quiet', 'ex200-heartbeat.timer')[0]
    if lab == 'services':
        return all(cmd('systemctl', op, '--quiet', unit)[0] for unit in ['sshd', 'chronyd'] for op in ['is-active', 'is-enabled']) and cmd('systemctl', 'get-default')[1] == 'multi-user.target'
    if lab == 'users':
        if criterion == 0:
            group = grp.getgrnam('operaciones')
            return all(pwd.getpwnam(name) and (name in group.gr_mem or pwd.getpwnam(name).pw_gid == group.gr_gid) for name in ['antonio', 'ana'])
        # Do not expose password hashes or include any shadow contents in the report.
        for row in read('/etc/shadow').splitlines():
            fields = row.split(':')
            if fields[0] == 'antonio':
                return fields[4] == '90' and fields[5] == '7'
        return False
    if lab == 'selinux':
        # Require persistent fcontext policy, in addition to the current label.
        active = cmd('getenforce')[1] == 'Enforcing'
        context = cmd('stat', '-c', '%C', '/srv/ex200/web')[1]
        ok, rules = cmd('semanage', 'fcontext', '-l', '-C')
        declared = any('/srv/ex200/web' in line and 'httpd_sys_content_t' in line for line in rules.splitlines())
        return active and ':httpd_sys_content_t:' in context and ok and declared
    return False

def report(attempt, requested, machine):
    results = []
    for lab in requested:
        if lab not in AUTO or MACHINE[lab] != machine:
            continue
        for criterion in AUTO[lab]:
            try:
                passed = bool(verify(lab, criterion))
                detail = 'El estado observado cumple este control local.' if passed else 'El estado observado no cumple todavía este control. Contrasta el criterio y la evidencia en la VM.'
            except (OSError, ValueError, KeyError, IndexError, subprocess.SubprocessError, tarfile.TarError) as err:
                passed = False
                detail = 'No se pudo comprobar: ' + type(err).__name__ + '. Revisa que existan el recurso y las herramientas requeridas.'
            results.append(dict(lab=lab, criterion=criterion, pass_=passed, machine=machine, detail=detail))
            results[-1]['pass'] = results[-1].pop('pass_')
    return dict(schema=1, kind='ex200-report', attempt=attempt,
                generatedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(), results=results)

def supported_guest(os_release):
    return bool(re.search(r'^ID=\"?rocky\"?$', os_release, re.M) and re.search(r'^VERSION_ID=\"?(?:9|10)(?:\.|\"|$)', os_release, re.M))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--attempt', required=True)
    parser.add_argument('--labs', required=True)
    args = parser.parse_args()
    if not re.fullmatch(r'[a-zA-Z0-9-]{8,80}', args.attempt):
        parser.error('Identificador de intento inválido.')
    os_release = read('/etc/os-release')
    if not supported_guest(os_release):
        parser.error('Verificador exclusivo para Rocky Linux 9/10; no se ejecuta en el host.')
    if os.geteuid() != 0:
        parser.error('Ejecuta con sudo dentro de la VM. Es una lectura local.')
    machine = cmd('hostname', '-s')[1]
    if machine not in ('server', 'client'):
        parser.error('Hostname esperado: server o client.')
    requested = args.labs.split(',')
    if any(not re.fullmatch(r'[a-z]+', x) for x in requested):
        parser.error('Lista de laboratorios inválida.')
    print('EX200_JSON=' + json.dumps(report(args.attempt, requested, machine), ensure_ascii=False))

if __name__ == '__main__':
    main()

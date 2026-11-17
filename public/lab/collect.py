#!/usr/bin/env python3
"""Run on Windows, macOS or Linux from the kit directory. Read Vagrant VMs, write a local JSON."""
import argparse
import datetime
import json
from pathlib import Path
import re
import shlex
import shutil
import subprocess
import sys

CONTRACT = json.loads((Path(__file__).resolve().parent / 'catalog-contract.json').read_text(encoding='utf-8'))
ALL_LABS = set(CONTRACT['labs'])
AUTO_MACHINE = {lab: item['machine'] for lab, item in CONTRACT['auto'].items()}

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--attempt', required=True, help='ID exacto que muestra la sesión web')
    p.add_argument('--labs', required=True, help='IDs separados por comas; copia el comando de la web')
    args = p.parse_args()
    requested = args.labs.split(',')
    if not re.fullmatch(r'[a-zA-Z0-9-]{8,80}', args.attempt) or any(x not in ALL_LABS for x in requested):
        p.error('Intento o laboratorios inválidos.')
    if not shutil.which('vagrant'):
        p.error('Instala Vagrant en tu sistema anfitrión antes de recoger evidencia.')
    root = Path(__file__).resolve().parent
    if not (root / 'Vagrantfile').exists():
        p.error('Falta Vagrantfile junto al recolector.')
    machines = sorted({AUTO_MACHINE[x] for x in requested if x in AUTO_MACHINE})
    if not machines:
        print('Estos retos se evalúan con evidencia y autoevaluación en la web. No tienen controles automáticos.', file=sys.stderr)
        return 0
    results = []
    for machine in machines:
        command = 'sudo python3 /opt/ex200/verify.py --attempt ' + shlex.quote(args.attempt) + ' --labs ' + shlex.quote(','.join(requested))
        print('Leyendo ' + machine + '…', file=sys.stderr)
        try:
            proc = subprocess.run(['vagrant','ssh',machine,'-c',command], cwd=root, capture_output=True, text=True, timeout=180)
            if proc.returncode:
                raise RuntimeError('No respondió el verificador. Comprueba vagrant status, SSH y que provision.sh terminó correctamente.')
            line = next((line.split('EX200_JSON=',1)[1] for line in proc.stdout.splitlines() if 'EX200_JSON=' in line), None)
            if line is None:
                raise RuntimeError('La VM no devolvió el formato esperado. No se ha generado un informe parcial.')
            data = json.loads(line)
            if data.get('attempt') != args.attempt or data.get('schema') != 1:
                raise RuntimeError('Informe incompatible.')
            expected = {(lab, criterion) for lab in requested if lab in CONTRACT['auto'] and CONTRACT['auto'][lab]['machine'] == machine for criterion in CONTRACT['auto'][lab]['criteria']}
            observed = {(row.get('lab'), row.get('criterion')) for row in data['results']}
            if observed != expected:
                raise RuntimeError('Verificador desactualizado o informe incompleto. Actualiza el kit y ejecuta vagrant provision antes del simulacro.')
            results.extend(data['results'])
        except (OSError, ValueError, KeyError, RuntimeError, subprocess.SubprocessError) as err:
            print('Error en ' + machine + ': ' + str(err), file=sys.stderr)
            return 1
    report = dict(schema=1,kind='ex200-report',attempt=args.attempt,
                  generatedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),results=results)
    output = root / 'informe-ex200.json'
    output.write_text(json.dumps(report,ensure_ascii=False,indent=2) + '\n', encoding='utf-8')
    print(f'Listo: {output.name} ({len(results)} controles). Importa este archivo en tu sesión web.')
    print('El recolector solo lee el estado. Los criterios de historial, consola, reinicio y diagnóstico requieren tu evidencia.')
    return 0

if __name__ == '__main__':
    sys.exit(main())

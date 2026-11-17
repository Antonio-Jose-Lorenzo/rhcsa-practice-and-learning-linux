import {L} from './locale.js';

export const author={
 name:'Antonio Jose Lorenzo',
 linkedin:'https://www.linkedin.com/in/antoniojoselorenzo',
 portfolio:'https://antoniojlorenzodev.vercel.app/',
 repository:'https://github.com/Antonio-Jose-Lorenzo/rhcsa-practice-and-learning-linux',
};

export function authorMarkup(){
 const link=(url,label)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
 return `<div class="author-credit"><span>${L('Creado por','Created by')} <strong>${author.name}</strong></span><nav aria-label="${L('Enlaces del autor','Author links')}">${link(author.linkedin,'LinkedIn')}${link(author.portfolio,L('Portafolio','Portfolio'))}${author.repository?link(author.repository,'GitHub'):`<span class="repo-pending">${L('Repositorio en GitHub · Próximamente','GitHub repository · Coming soon')}</span>`}</nav></div>`;
}

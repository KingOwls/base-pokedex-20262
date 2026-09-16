import {assetUrl} from '../../utils/assets.js';
export default function CrowlethNote({children,title='Nota de Crowleth'}){return <aside className="crowleth-note"><img src={assetUrl('crowleth/Notas_Crowleth.png')} alt="Crowleth con una nota"/><div><strong>{title}</strong><p>{children}</p></div></aside>}

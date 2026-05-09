import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const fromRoot = (...parts) => path.join(root, ...parts);

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const read = (...parts) => fs.readFileSync(fromRoot(...parts), "utf8");
const write = (relativePath, content) => {
  const target = fromRoot(relativePath);
  ensureDir(path.dirname(target));
  fs.writeFileSync(target, content.replace(/\r\n/g, "\n"), "utf8");
};

const fileHash = (filePath) => crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");

const copyFile = (sourceRelative, targetRelative, manifest, type, note = "") => {
  const source = fromRoot(...sourceRelative.split("/"));
  const target = fromRoot(...targetRelative.split("/"));
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
  manifest.push({
    type,
    source: sourceRelative,
    target: targetRelative,
    bytes: fs.statSync(target).size,
    sha256: fileHash(target),
    note,
  });
};

const fileExists = (relativePath) => fs.existsSync(fromRoot(...relativePath.split("/")));

const sizeLabel = (bytes) => {
  if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes > 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
};

const manifest = [];

const copyTasks = [
  ["SmartAgriculture/assets/images/arquitectura-iot.svg", "assets/images/arquitectura-iot.svg", "image", "Diagrama moderno original"],
  ["SmartAgriculture/assets/images/sensor-cultivo.svg", "assets/images/sensor-cultivo.svg", "image", "Ilustración moderna original"],
  ["SmartAgriculture/assets/images/smartrovert-lab.svg", "assets/images/smartrovert-lab.svg", "image", "Ilustración moderna original"],
  ["SmartAgriculture/assets/images/vision-artificial-cultivo.svg", "assets/images/vision-artificial-cultivo.svg", "image", "Ilustración moderna original"],
  ["contenido-cristian/smartrovert-ctei-main/assets/icons/favicon.ico", "assets/icons/favicon.ico", "icon", "Favicon heredado integrado"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/avataaars.svg", "assets/images/academic/avataaars.svg", "image", "Recurso gráfico heredado"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/robot/smartrovert-banner.png", "assets/images/robot/smartrovert-banner.png", "image", "Foto/arte del robot"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/robot/prototipo1.jpg", "assets/images/robot/prototipo1.jpg", "image", "Foto del prototipo"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/robot/pruebas.jpg", "assets/images/robot/pruebas.jpg", "image", "Foto de pruebas"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/robot/sensores.jpg", "assets/images/robot/sensores.jpg", "image", "Foto de sensores"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/mapa-actores.png", "assets/images/marco-logico/mapa-actores.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/arbol-problemas.png", "assets/images/marco-logico/arbol-problemas.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/arbol-efectos.png", "assets/images/marco-logico/arbol-efectos.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/arbol-causas.png", "assets/images/marco-logico/arbol-causas.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/arbol-objetivos.png", "assets/images/marco-logico/arbol-objetivos.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/arbol-fines.png", "assets/images/marco-logico/arbol-fines.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/arbol-medios.png", "assets/images/marco-logico/arbol-medios.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/relacion-medios-acciones.png", "assets/images/marco-logico/relacion-medios-acciones.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/arbol-acciones.png", "assets/images/marco-logico/arbol-acciones.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/eap-smartrovert.png", "assets/images/marco-logico/eap-smartrovert.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/grafica-indicadores-general.png", "assets/images/marco-logico/grafica-indicadores-general.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/flujo-verificacion.png", "assets/images/marco-logico/flujo-verificacion.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/arquitectura-monitoreo.png", "assets/images/marco-logico/arquitectura-monitoreo.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/marco-logico/mapa-riesgos.png", "assets/images/marco-logico/mapa-riesgos.png", "image", "Marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/portfolio/cabin.png", "assets/images/portfolio-legacy/cabin.png", "image", "Recurso gráfico secundario conservado"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/portfolio/cake.png", "assets/images/portfolio-legacy/cake.png", "image", "Recurso gráfico secundario conservado"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/portfolio/circus.png", "assets/images/portfolio-legacy/circus.png", "image", "Recurso gráfico secundario conservado"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/portfolio/game.png", "assets/images/portfolio-legacy/game.png", "image", "Recurso gráfico secundario conservado"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/portfolio/safe.png", "assets/images/portfolio-legacy/safe.png", "image", "Recurso gráfico secundario conservado"],
  ["contenido-cristian/smartrovert-ctei-main/assets/img/portfolio/submarine.png", "assets/images/portfolio-legacy/submarine.png", "image", "Recurso gráfico secundario conservado"],
  ["SmartAgriculture/assets/docs/anteproyecto-smartagriculture.pdf", "assets/docs/anteproyecto-smartagriculture.pdf", "document", "Anteproyecto PDF deduplicado"],
  ["contenido-cristian/smartrovert-ctei-main/documents/anteproyecto.docx", "assets/docs/anteproyecto-smartagriculture.docx", "document", "Versión editable del anteproyecto"],
  ["SmartAgriculture/assets/docs/RAE-20-CITAS.pdf", "assets/docs/RAE-20-CITAS.pdf", "document", "Documento académico principal"],
  ["SmartAgriculture/assets/docs/tema-pregunta-objetivo.pdf", "assets/docs/tema-pregunta-objetivo.pdf", "document", "Documento académico principal"],
  ["contenido-cristian/smartrovert-ctei-main/documents/matriz_consistencia.pdf", "assets/docs/matriz-consistencia.pdf", "document", "Matriz escaneada preservada"],
  ["contenido-cristian/smartrovert-ctei-main/documents/matriz_operacionalizacion.pdf", "assets/docs/matriz-operacionalizacion.pdf", "document", "Matriz escaneada preservada"],
  ["contenido-cristian/smartrovert-ctei-main/documents/matriz-marco-logico-smartrovert.pdf", "assets/docs/matriz-marco-logico-smartrovert.pdf", "document", "Matriz de marco lógico"],
  ["contenido-cristian/smartrovert-ctei-main/documents/matriz-marco-logico-smartrovert.docx", "assets/docs/matriz-marco-logico-smartrovert.docx", "document", "Versión editable de la matriz"],
  ["contenido-cristian/smartrovert-ctei-main/documents/~$triz-marco-logico-smartrovert.docx", "assets/docs/revision/word-lock-matriz-marco-logico-smartrovert.docx", "document", "Archivo temporal de Word conservado para auditoría"],
];

for (const [source, target, type, note] of copyTasks) {
  copyFile(source, target, manifest, type, note);
}

write("assets/manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
write(".nojekyll", "");

const navMenu = `
      <div class="nav-menu" id="navMenu">
        <a href="#inicio">Inicio</a>
        <a href="#problema">Problema</a>
        <a href="#objetivos">Objetivos</a>
        <a href="#documentacion">Docs</a>
        <a href="pages/marco-logico.html">Marco lógico</a>
        <a href="pages/matrices.html">Matrices</a>
        <a href="pages/metodologia.html">Metodología</a>
        <a href="#galeria">Galería</a>
        <a href="#impacto">Impacto</a>
      </div>`;

const docIcon = `<svg viewBox="0 0 24 24"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z"></path><path d="M14 2v5h5M8 13h8M8 17h6M8 9h2"></path></svg>`;

const docCard = ({ category, title, text, href, download = true, extraHref = "", status = "Integrado" }) => `
          <article class="doc-card doc-premium reveal">
            <div class="doc-card-top">
              <div class="doc-icon pdf-icon" aria-hidden="true">${docIcon}</div>
              <span class="doc-status available">${status}</span>
            </div>
            <span class="doc-category">${category}</span>
            <h3>${title}</h3>
            <p>${text}</p>
            <div class="doc-actions">
              <a class="download-btn" href="${href}" target="_blank" rel="noreferrer">Abrir</a>
              ${download ? `<a class="download-btn" href="${href}" download>Descargar</a>` : ""}
              ${extraHref}
            </div>
          </article>`;

const documentationSection = `
    <section class="section" id="documentacion">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Centro de documentación</span>
          <h2>Documentación académica integrada</h2>
          <p>Biblioteca final con anteproyecto, matrices, marco lógico, recursos visuales y documentos editables, sin depender de las carpetas originales.</p>
        </div>

        <div class="doc-grid premium-docs">
${docCard({
  category: "Anteproyecto",
  title: "Anteproyecto SmartAgriculture",
  text: "Documento formal del proyecto con problema, objetivos, marco conceptual, metodología, presupuesto y enfoque de agricultura inteligente.",
  href: "assets/docs/anteproyecto-smartagriculture.pdf",
  extraHref: `<a class="download-btn" href="assets/docs/anteproyecto-smartagriculture.docx" target="_blank" rel="noreferrer">DOCX</a>`,
})}
${docCard({
  category: "Investigación",
  title: "RAE 20 citas",
  text: "Compilación de antecedentes y referencias técnicas sobre IoT, visión artificial, robótica agrícola y smart farming.",
  href: "assets/docs/RAE-20-CITAS.pdf",
})}
${docCard({
  category: "Formulación",
  title: "Tema, pregunta y objetivo",
  text: "Delimitación académica del tema de investigación, pregunta orientadora y objetivos del sistema SmartRovert.",
  href: "assets/docs/tema-pregunta-objetivo.pdf",
})}
${docCard({
  category: "Marco lógico",
  title: "Matriz de Marco Lógico",
  text: "Documento completo con indicadores, medios de verificación, supuestos, componentes, actividades y resumen narrativo.",
  href: "assets/docs/matriz-marco-logico-smartrovert.pdf",
  extraHref: `<a class="download-btn" href="assets/docs/matriz-marco-logico-smartrovert.docx" target="_blank" rel="noreferrer">DOCX</a>`,
})}
${docCard({
  category: "Matriz",
  title: "Matriz de Consistencia",
  text: "Relación entre problema, pregunta de investigación, objetivos, variables e hipótesis del proyecto.",
  href: "assets/docs/matriz-consistencia.pdf",
})}
${docCard({
  category: "Matriz",
  title: "Matriz de Operacionalización",
  text: "Organización de variables, dimensiones, indicadores, instrumentos y criterios de medición del estudio.",
  href: "assets/docs/matriz-operacionalizacion.pdf",
})}
        </div>

        <div class="section-actions reveal">
          <a class="btn btn-primary" href="pages/documentacion.html">Ver biblioteca completa</a>
          <a class="btn btn-secondary" href="pages/marco-logico.html">Explorar marco lógico</a>
        </div>
      </div>
    </section>`;

const gallerySection = `
    <section class="section section-alt" id="galeria">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Galería SmartRovert</span>
          <h2>Visuales reales y diagramas del sistema</h2>
          <p>Galería responsive con prototipo, sensores, pruebas y recursos metodológicos migrados desde el proyecto académico.</p>
        </div>

        <div class="gallery-grid gallery-grid-expanded">
          ${[
            ["assets/images/robot/smartrovert-banner.png", "SmartRovert", "Vista principal del sistema SmartRovert."],
            ["assets/images/robot/prototipo1.jpg", "Prototipo", "Evidencia visual del prototipo físico."],
            ["assets/images/robot/pruebas.jpg", "Pruebas", "Validación y pruebas de componentes."],
            ["assets/images/robot/sensores.jpg", "Sensores", "Módulos de monitoreo ambiental."],
            ["assets/images/marco-logico/arquitectura-monitoreo.png", "Arquitectura de monitoreo", "Flujo técnico para recolección y validación."],
            ["assets/images/marco-logico/mapa-actores.png", "Mapa de actores", "Actores académicos, agrícolas y tecnológicos."],
          ].map(([src, title, text]) => `
          <figure class="image-card reveal">
            <img src="${src}" alt="${title} SmartRovert">
            <figcaption><strong>${title}</strong><span>${text}</span></figcaption>
          </figure>`).join("")}
        </div>
      </div>
    </section>`;

const matrixAndLogicSection = `
    <section class="section" id="marco-logico">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Planificación científica</span>
          <h2>Marco lógico y matrices integradas</h2>
          <p>El contenido académico fue reconstruido como módulos de lectura, tablas responsivas, diagramas descargables y documentos verificables.</p>
        </div>

        <div class="matrix-dashboard">
          <article class="metric-panel reveal">
            <span>09</span>
            <strong>Pasos metodológicos</strong>
            <p>Involucrados, problema, objetivos, estrategia, EAP, resumen narrativo, indicadores, verificación y supuestos.</p>
          </article>
          <article class="metric-panel reveal">
            <span>15</span>
            <strong>Diagramas integrados</strong>
            <p>Árboles, mapas, arquitectura de monitoreo, riesgos, indicadores y flujo de verificación.</p>
          </article>
          <article class="metric-panel reveal">
            <span>03</span>
            <strong>Matrices académicas</strong>
            <p>Marco lógico, consistencia y operacionalización preservadas en PDF con vistas modernas.</p>
          </article>
        </div>

        <div class="table-shell reveal">
          <table>
            <thead>
              <tr>
                <th>Nivel</th>
                <th>Resumen narrativo</th>
                <th>Indicadores</th>
                <th>Medios de verificación</th>
                <th>Supuestos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fin</td>
                <td>Contribuir a una agricultura eficiente, inteligente y sostenible.</td>
                <td>Mejora en gestión de recursos, trazabilidad y supervisión agrícola.</td>
                <td>Reportes, bitácoras, evidencias fotográficas y documentación técnica.</td>
                <td>Interés de agricultores en tecnologías inteligentes.</td>
              </tr>
              <tr>
                <td>Propósito</td>
                <td>Automatizar el monitoreo agrícola mediante SmartRovert.</td>
                <td>Monitoreo remoto, captura ambiental e imágenes de cultivo operativas.</td>
                <td>Dashboard, registros IoT, pruebas funcionales y capturas de monitoreo.</td>
                <td>Conectividad suficiente y suministro eléctrico estable.</td>
              </tr>
              <tr>
                <td>Componentes</td>
                <td>Sensores IoT, automatización agrícola, visión artificial, monitoreo remoto y base de datos.</td>
                <td>Sensores instalados, cámaras operativas, plataforma funcional y datos almacenados.</td>
                <td>Pruebas de funcionamiento, evidencias visuales, base de datos y reportes.</td>
                <td>Compatibilidad tecnológica y estabilidad del sistema IoT.</td>
              </tr>
              <tr>
                <td>Actividades</td>
                <td>Instalar sensores, configurar automatización, integrar cámaras e implementar monitoreo remoto.</td>
                <td>Fases ejecutadas según cronograma y entregables del proyecto.</td>
                <td>Informes, repositorio, cronograma, pruebas y sustentación académica.</td>
                <td>Recursos tecnológicos y entornos de validación disponibles.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section-actions reveal">
          <a class="btn btn-primary" href="pages/marco-logico.html">Ver marco lógico completo</a>
          <a class="btn btn-secondary" href="pages/matrices.html">Ver matrices</a>
          <a class="btn btn-secondary" href="pages/metodologia.html">Ver metodología</a>
        </div>
      </div>
    </section>`;

const methodologyPreview = `
    <section class="section section-alt" id="metodologia">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Metodología aplicada</span>
          <h2>Ruta de investigación SmartRovert</h2>
          <p>La planeación integra diagnóstico de actores, análisis causal, objetivos, estrategia, EAP, indicadores, verificaciones y supuestos críticos.</p>
        </div>
        <div class="method-mini-grid">
          ${[
            ["01", "Diagnóstico", "Actores, problema central y causas del monitoreo agrícola manual."],
            ["02", "Diseño estratégico", "Objetivos, medios, acciones, componentes y actividades tecnológicas."],
            ["03", "Control y validación", "Indicadores, medios de verificación, riesgos y supuestos de sostenibilidad."],
          ].map(([n, title, text]) => `<article class="method-mini reveal"><span>${n}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}
        </div>
      </div>
    </section>`;

let indexHtml = read("SmartAgriculture", "index.html");
indexHtml = indexHtml.replace("</title>", `</title>\n  <link rel="icon" type="image/x-icon" href="assets/icons/favicon.ico">`);
indexHtml = indexHtml.replace(/<div class="nav-menu" id="navMenu">[\s\S]*?<\/div>\s*<\/nav>/, `${navMenu}\n    </nav>`);
indexHtml = indexHtml.replace(/<section class="section" id="documentacion">[\s\S]*?<\/section>\s*<section class="section section-alt" id="marco-teorico">/, `${documentationSection}\n\n    <section class="section section-alt" id="marco-teorico">`);
indexHtml = indexHtml.replace(/<section class="section section-alt" id="galeria">[\s\S]*?<\/section>\s*<section class="section" id="marco-logico">/, `${gallerySection}\n\n    <section class="section" id="marco-logico">`);
indexHtml = indexHtml.replace(/<section class="section" id="marco-logico">[\s\S]*?<\/section>\s*<section class="section section-alt" id="tecnologias">/, `${matrixAndLogicSection}\n\n    <section class="section section-alt" id="tecnologias">`);
indexHtml = indexHtml.replace(/<section class="section" id="timeline">/, `${methodologyPreview}\n\n    <section class="section" id="timeline">`);
indexHtml = indexHtml.replace(/<div class="footer-links" aria-label="Enlaces externos">[\s\S]*?<\/div>/, `<div class="footer-links" aria-label="Enlaces de plataforma">
        <a href="pages/marco-logico.html">Marco lógico</a>
        <a href="pages/matrices.html">Matrices</a>
        <a href="pages/metodologia.html">Metodología</a>
        <a href="pages/documentacion.html">Documentación</a>
      </div>`);
write("index.html", indexHtml);

const extraCss = `

/* Fusion SmartAgriculture */
.section-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}

.gallery-grid-expanded {
  grid-template-columns: 1fr;
}

.matrix-dashboard,
.method-mini-grid,
.resource-grid,
.method-flow,
.asset-gallery,
.document-list,
.preview-grid,
.matrix-card-grid {
  display: grid;
  gap: 16px;
}

.matrix-dashboard {
  margin-bottom: 20px;
}

.metric-panel,
.method-mini,
.page-hero-card,
.resource-card,
.method-step,
.matrix-card,
.fusion-card,
.notice-panel,
.asset-card {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 12px 34px rgba(27, 31, 30, 0.06);
}

.metric-panel,
.method-mini,
.resource-card,
.method-step,
.matrix-card,
.fusion-card,
.notice-panel,
.asset-card {
  padding: 20px;
}

.metric-panel span,
.method-mini span,
.method-step span,
.matrix-card span,
.resource-card .resource-type {
  display: inline-grid;
  place-items: center;
  min-width: 42px;
  min-height: 34px;
  padding: 0 10px;
  border-radius: var(--radius);
  color: var(--blue-700);
  background: rgba(66, 165, 245, 0.12);
  font-family: "Montserrat", "Inter", sans-serif;
  font-weight: 800;
}

.metric-panel strong,
.method-step strong {
  display: block;
  margin-top: 12px;
  font-family: "Montserrat", "Inter", sans-serif;
  font-size: 1.05rem;
}

.metric-panel p,
.method-mini p,
.resource-card p,
.method-step p,
.matrix-card p,
.fusion-card p,
.notice-panel p,
.asset-card p {
  color: var(--muted);
}

.page-hero {
  position: relative;
  overflow: hidden;
  padding: 84px 0 54px;
  background:
    radial-gradient(circle at 12% 24%, rgba(102, 187, 106, 0.18), transparent 30%),
    radial-gradient(circle at 86% 20%, rgba(66, 165, 245, 0.16), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(244, 247, 242, 0.92));
  border-bottom: 1px solid rgba(221, 229, 221, 0.72);
}

.page-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(46, 125, 50, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(21, 101, 192, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, black, transparent 84%);
}

.page-hero .container {
  position: relative;
  z-index: 1;
}

.page-hero-grid {
  display: grid;
  gap: 22px;
  align-items: end;
}

.page-hero h1 {
  margin: 10px 0 0;
  font-family: "Montserrat", "Inter", sans-serif;
  font-size: 2.55rem;
  line-height: 1.05;
}

.page-hero p {
  max-width: 780px;
  color: var(--muted);
}

.page-hero-card {
  padding: 18px;
  background:
    linear-gradient(135deg, rgba(46, 125, 50, 0.1), rgba(66, 165, 245, 0.12)),
    rgba(255, 255, 255, 0.88);
}

.page-hero-card strong {
  display: block;
  color: var(--green-700);
  font-family: "Montserrat", "Inter", sans-serif;
  font-size: 1.8rem;
}

.page-tabs {
  position: sticky;
  top: 0;
  z-index: 80;
  padding: 12px 0;
  border-bottom: 1px solid rgba(221, 229, 221, 0.72);
  background: rgba(244, 247, 242, 0.86);
  backdrop-filter: blur(16px);
}

.page-tabs .container {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: thin;
}

.page-tabs a {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(46, 125, 50, 0.16);
  border-radius: var(--radius);
  color: var(--green-700);
  background: rgba(255, 255, 255, 0.72);
  font-weight: 800;
  font-size: 0.82rem;
}

.resource-card,
.matrix-card,
.method-step,
.fusion-card,
.asset-card {
  transition: transform 0.28s var(--ease), box-shadow 0.28s ease, border-color 0.28s ease;
}

.resource-card:hover,
.matrix-card:hover,
.method-step:hover,
.fusion-card:hover,
.asset-card:hover {
  transform: translateY(-5px);
  border-color: rgba(46, 125, 50, 0.28);
  box-shadow: 0 20px 48px rgba(21, 101, 192, 0.12), 0 0 0 4px rgba(165, 214, 167, 0.12);
}

.resource-card h3,
.method-mini h3,
.method-step h3,
.matrix-card h3,
.fusion-card h3,
.notice-panel h3,
.asset-card h3,
.section-title {
  margin: 12px 0 0;
  font-family: "Montserrat", "Inter", sans-serif;
  line-height: 1.22;
}

.resource-actions,
.asset-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.pdf-frame {
  width: 100%;
  height: 460px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: #fff;
}

.preview-grid {
  margin-top: 18px;
}

.preview-grid .pdf-frame {
  height: 380px;
}

.method-flow {
  grid-template-columns: 1fr;
}

.method-step {
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(244, 247, 242, 0.68)),
    var(--card);
}

.method-step::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: linear-gradient(90deg, var(--green-400), var(--blue-400));
}

.fusion-card {
  margin-bottom: 20px;
}

.fusion-card .fusion-card {
  box-shadow: none;
  background: rgba(244, 247, 242, 0.72);
}

.rich-text,
.fusion-card li {
  color: var(--muted);
  font-size: 1rem;
}

.method-badge {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  padding: 0 10px;
  border-radius: var(--radius);
  color: var(--green-700);
  background: rgba(102, 187, 106, 0.14);
  font-weight: 800;
}

.academic-table-shell {
  margin-top: 16px;
  margin-bottom: 18px;
}

.academic-table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
}

.academic-table th,
.academic-table td {
  padding: 15px 14px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}

.academic-table thead th {
  color: var(--card);
  background: linear-gradient(135deg, var(--green-700), var(--blue-700));
  font-size: 0.82rem;
}

.document-image {
  width: 100%;
  height: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 16px 38px rgba(27, 31, 30, 0.1);
}

.image-frame {
  overflow-x: auto;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.72);
}

.asset-card {
  display: grid;
  gap: 12px;
}

.asset-card img {
  width: 100%;
  height: 170px;
  object-fit: contain;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: rgba(244, 247, 242, 0.8);
}

.notice-panel {
  border-color: rgba(21, 101, 192, 0.22);
  background:
    linear-gradient(135deg, rgba(66, 165, 245, 0.1), rgba(165, 214, 167, 0.12)),
    var(--card);
}

.text-center { text-align: center; }
.text-muted { color: var(--muted); }
.fw-bold { font-weight: 800; }
.text-uppercase { text-transform: uppercase; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
.mb-5 { margin-bottom: 22px; }
.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }
.mt-5 { margin-top: 22px; }
.ms-2 { margin-left: 8px; }
.m-2 { margin: 8px; }
.py-4 { padding-block: 16px; }
.h-100 { height: 100%; }
.d-flex { display: flex; }
.flex-wrap { flex-wrap: wrap; }

.row {
  display: grid;
  gap: 16px;
}

.col-md-6,
.col-lg-6,
.col-lg-8,
.col-lg-10 {
  min-width: 0;
}

@media (min-width: 680px) {
  .gallery-grid-expanded,
  .matrix-dashboard,
  .method-mini-grid,
  .resource-grid,
  .asset-gallery,
  .matrix-card-grid,
  .preview-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 980px) {
  .page-hero-grid {
    grid-template-columns: minmax(0, 1.25fr) 280px;
  }

  .gallery-grid-expanded,
  .resource-grid,
  .asset-gallery,
  .method-flow {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .matrix-dashboard,
  .method-mini-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .matrix-card-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .page-hero h1 {
    font-size: 2.1rem;
    overflow-wrap: anywhere;
  }

  .pdf-frame {
    height: 360px;
  }
}
`;

write("style.css", `${read("SmartAgriculture", "style.css")}${extraCss}`);

let script = read("SmartAgriculture", "script.js");
script = script.replace(
  '".btn, .download-btn, .doc-card, .tech-card, .impact-card, .objective-card, .image-card, .architecture-node, .timeline-item"',
  '".btn, .download-btn, .doc-card, .tech-card, .impact-card, .objective-card, .image-card, .architecture-node, .timeline-item, .resource-card, .fusion-card, .method-step, .matrix-card, .asset-card"'
);
write("script.js", script);

const footer = (prefix = "../") => `
  <button class="back-to-top" id="backToTop" type="button" aria-label="Volver arriba">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>
  </button>

  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <a class="brand footer-brand" href="${prefix}index.html#inicio">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32"><path d="M16 3.5 27.2 10v12L16 28.5 4.8 22V10L16 3.5Z"></path><path d="M10.8 17.2c4.8.1 8.2-2.3 10.4-7.1 1.3 5-.5 9.5-4.8 12.7-2.4-2.2-4.2-3.6-7.2-3.5.4-.7.9-1.4 1.6-2.1Z"></path></svg>
          </span>
          <span>SMARTAGRICULTURE</span>
        </a>
        <p>Universidad de Cundinamarca<br>Ingeniería de Sistemas y Computación</p>
      </div>
      <div class="footer-links" aria-label="Enlaces de plataforma">
        <a href="${prefix}index.html">Inicio</a>
        <a href="${prefix}pages/marco-logico.html">Marco lógico</a>
        <a href="${prefix}pages/matrices.html">Matrices</a>
        <a href="${prefix}pages/metodologia.html">Metodología</a>
        <a href="${prefix}pages/documentacion.html">Docs</a>
      </div>
    </div>
    <div class="footer-bottom container">
      <span>SMARTAGRICULTURE © 2026</span>
      <span>SmartRovert · Sabana Norte de Cundinamarca</span>
    </div>
  </footer>`;

const header = (prefix = "../", navLinks = []) => `
  <div class="cursor-light" aria-hidden="true"></div>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <header class="site-header" id="siteHeader">
    <nav class="navbar container" aria-label="Navegación principal">
      <a class="brand" href="${prefix}index.html#inicio" aria-label="SmartAgriculture inicio">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32"><path d="M16 3.5 27.2 10v12L16 28.5 4.8 22V10L16 3.5Z"></path><path d="M10.8 17.2c4.8.1 8.2-2.3 10.4-7.1 1.3 5-.5 9.5-4.8 12.7-2.4-2.2-4.2-3.6-7.2-3.5.4-.7.9-1.4 1.6-2.1Z"></path></svg>
        </span>
        <span>SmartAgriculture</span>
      </a>
      <button class="nav-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="navMenu">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-menu" id="navMenu">
        <a href="${prefix}index.html">Inicio</a>
        ${navLinks.map(([href, label]) => `<a href="${href}">${label}</a>`).join("\n        ")}
        <a href="${prefix}pages/documentacion.html">Docs</a>
      </div>
    </nav>
  </header>`;

const pageShell = ({ title, description, eyebrow, heroTitle, heroText, heroMetric, heroMetricLabel, heroId = "inicio", navLinks, tabs, content }) => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <title>${title} | SmartAgriculture</title>
  <link rel="icon" type="image/x-icon" href="../assets/icons/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../style.css">
</head>
<body>
${header("../", navLinks)}
  <main id="contenido">
    <section class="page-hero" id="${heroId}">
      <div class="particle-field" id="particleField" aria-hidden="true"></div>
      <div class="container page-hero-grid">
        <div class="reveal">
          <span class="eyebrow">${eyebrow}</span>
          <h1>${heroTitle}</h1>
          <p>${heroText}</p>
        </div>
        <aside class="page-hero-card reveal reveal-delay">
          <strong>${heroMetric}</strong>
          <span>${heroMetricLabel}</span>
        </aside>
      </div>
    </section>
    ${tabs?.length ? `<nav class="page-tabs" aria-label="Secciones internas"><div class="container">${tabs.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}</div></nav>` : ""}
${content}
  </main>
${footer("../")}
  <script src="../script.js"></script>
</body>
</html>
`;

const transformMarcoLogico = () => {
  const source = read("contenido-cristian", "smartrovert-ctei-main", "pages", "marco-logico.html");
  const match = source.match(/<!-- INTRO -->[\s\S]*?<!-- FOOTER -->/);
  if (!match) throw new Error("No se pudo extraer el cuerpo del marco lógico.");
  let content = match[0].replace("<!-- FOOTER -->", "");
  content = content
    .replace(/\.\.\/assets\/img\/marco-logico\//g, "../assets/images/marco-logico/")
    .replace(/\sstyle="[^"]*"/g, "")
    .replace(/class="section-custom section-white"/g, 'class="section academic-section"')
    .replace(/class="page-section bg-light"/g, 'class="section section-alt academic-section"')
    .replace(/class="page-section"/g, 'class="section academic-section"')
    .replace(/class="card-custom mb-5"/g, 'class="fusion-card reveal"')
    .replace(/class="card-custom h-100"/g, 'class="fusion-card reveal h-100"')
    .replace(/class="card-custom"/g, 'class="fusion-card reveal"')
    .replace(/class="lead text-center"/g, 'class="rich-text text-center"')
    .replace(/class="lead mb-0"/g, 'class="rich-text"')
    .replace(/class="lead"/g, 'class="rich-text"')
    .replace(/class="table-responsive mt-4"/g, 'class="table-shell academic-table-shell"')
    .replace(/class="table-responsive"/g, 'class="table-shell academic-table-shell"')
    .replace(/class="table table-bordered table-hover align-middle"/g, 'class="academic-table"')
    .replace(/class="table table-bordered table-hover"/g, 'class="academic-table"')
    .replace(/class="table table-bordered align-middle"/g, 'class="academic-table"')
    .replace(/class="table-dark"/g, "")
    .replace(/class="badge bg-success"/g, 'class="method-badge"')
    .replace(/class="img-fluid rounded shadow"/g, 'class="document-image"')
    .replace(/class="btn btn-success"/g, 'class="download-btn"')
    .replace(/class="btn btn-dark ms-2"/g, 'class="download-btn"')
    .replace(/class="btn btn-dark"/g, 'class="download-btn"')
    .replace(/<figure class="text-center mt-5">/g, '<figure class="image-frame text-center mt-5">');
  return content;
};

write("pages/marco-logico.html", pageShell({
  title: "Marco lógico",
  description: "Marco lógico completo del proyecto SmartRovert con involucrados, árboles, EAP, indicadores, medios de verificación y supuestos.",
  eyebrow: "Marco lógico completo",
  heroTitle: "Planeación metodológica SmartRovert",
  heroText: "Desarrollo profesional del marco lógico del proyecto: actores, problema central, objetivos, estrategias, EAP, resumen narrativo, indicadores, medios de verificación y supuestos críticos.",
  heroMetric: "9 pasos",
  heroMetricLabel: "Metodología integrada",
  heroId: "marco-logico",
  navLinks: [
    ["#involucrados", "Involucrados"],
    ["#analisis-problema", "Problema"],
    ["#analisis-objetivos", "Objetivos"],
    ["#indicadores", "Indicadores"],
    ["matrices.html", "Matrices"],
  ],
  tabs: [
    ["#involucrados", "Involucrados"],
    ["#analisis-problema", "Problema"],
    ["#analisis-objetivos", "Objetivos"],
    ["#seleccion-estrategia", "Estrategia"],
    ["#estructura-analitica-proyecto", "EAP"],
    ["#resumen-narrativo", "Resumen"],
    ["#indicadores", "Indicadores"],
    ["#medios-verificacion", "Verificación"],
    ["#supuestos", "Supuestos"],
  ],
  content: transformMarcoLogico(),
}));

const resourceCard = ({ type, title, text, href, secondary = "" }) => `
        <article class="resource-card reveal">
          <span class="resource-type">${type}</span>
          <h3>${title}</h3>
          <p>${text}</p>
          <div class="resource-actions">
            <a class="download-btn" href="${href}" target="_blank" rel="noreferrer">Abrir</a>
            <a class="download-btn" href="${href}" download>Descargar</a>
            ${secondary}
          </div>
        </article>`;

const matricesContent = `
    <section class="section">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Matrices académicas</span>
          <h2>Consistencia, operacionalización y marco lógico</h2>
          <p>Las matrices se integran con vistas PDF funcionales y una reconstrucción visual de lectura rápida para navegación académica.</p>
        </div>
        <div class="resource-grid">
${resourceCard({
  type: "PDF",
  title: "Matriz de Consistencia",
  text: "Documento escaneado que relaciona problema, pregunta, objetivos, hipótesis y variables.",
  href: "../assets/docs/matriz-consistencia.pdf",
})}
${resourceCard({
  type: "PDF",
  title: "Matriz de Operacionalización",
  text: "Documento escaneado con variables, dimensiones, indicadores e instrumentos de medición.",
  href: "../assets/docs/matriz-operacionalizacion.pdf",
})}
${resourceCard({
  type: "PDF + DOCX",
  title: "Matriz de Marco Lógico",
  text: "Matriz con objetivo general, indicadores, medios de verificación, supuestos, componentes y actividades.",
  href: "../assets/docs/matriz-marco-logico-smartrovert.pdf",
  secondary: `<a class="download-btn" href="../assets/docs/matriz-marco-logico-smartrovert.docx" target="_blank" rel="noreferrer">DOCX</a>`,
})}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Lectura ejecutiva</span>
          <h2>Matriz de consistencia reconstruida</h2>
          <p>Resumen visual basado en los documentos del proyecto y en la formulación académica consolidada.</p>
        </div>
        <div class="table-shell reveal">
          <table>
            <thead>
              <tr><th>Eje</th><th>Contenido integrado</th><th>Uso dentro del proyecto</th></tr>
            </thead>
            <tbody>
              <tr><td>Problema</td><td>Baja tecnificación, monitoreo manual, detección tardía de afectaciones y uso ineficiente de recursos en cultivos de pequeña escala.</td><td>Define la necesidad de un sistema autónomo de monitoreo agrícola.</td></tr>
              <tr><td>Pregunta</td><td>¿Cómo optimizar el monitoreo de variables ambientales en cultivos agrícolas mediante IoT, automatización y visión artificial?</td><td>Orienta la arquitectura SmartRovert y sus pruebas.</td></tr>
              <tr><td>Objetivo general</td><td>Desarrollar un sistema inteligente de monitoreo agrícola basado en IoT y visión artificial para optimizar la supervisión de variables ambientales.</td><td>Conecta el prototipo, el dashboard, los sensores y la validación académica.</td></tr>
              <tr><td>Variables</td><td>Monitoreo agrícola inteligente, automatización, sensórica IoT, visión artificial, trazabilidad y eficiencia de supervisión.</td><td>Sirven como base para indicadores, medición y operacionalización.</td></tr>
              <tr><td>Resultados esperados</td><td>SmartRovert funcional, monitoreo remoto, captura automática de datos, evidencias visuales y reducción de procesos manuales.</td><td>Permiten evaluar desempeño técnico, académico y de impacto.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Variables e indicadores</span>
          <h2>Matriz de operacionalización reconstruida</h2>
          <p>Organización profesional de las variables y criterios medibles del sistema SmartRovert.</p>
        </div>
        <div class="table-shell reveal">
          <table>
            <thead>
              <tr><th>Variable</th><th>Dimensión</th><th>Indicadores</th><th>Instrumentos / verificación</th></tr>
            </thead>
            <tbody>
              <tr><td>Monitoreo agrícola inteligente</td><td>Lectura ambiental continua</td><td>Sensores instalados, variables registradas, frecuencia de captura y estabilidad de lectura.</td><td>Reportes técnicos, registros del sistema y pruebas funcionales.</td></tr>
              <tr><td>Automatización del prototipo</td><td>Integración hardware/software</td><td>Procesos automatizados, comunicación ESP32/Raspberry Pi y funcionamiento de módulos.</td><td>Bitácoras de integración, evidencias fotográficas y repositorio.</td></tr>
              <tr><td>Visión artificial</td><td>Captura y análisis visual</td><td>Cámaras operativas, imágenes recolectadas y pruebas de detección temprana.</td><td>Evidencias visuales, capturas de monitoreo y validaciones técnicas.</td></tr>
              <tr><td>Monitoreo remoto</td><td>Visualización y trazabilidad</td><td>Dashboard funcional, registros de conexión y disponibilidad de datos.</td><td>Capturas del dashboard, logs y reportes de conexión.</td></tr>
              <tr><td>Impacto esperado</td><td>Optimización de recursos</td><td>Reducción de procesos manuales, mejora de supervisión y apoyo a decisiones agrícolas.</td><td>Informes comparativos, análisis académico y sustentación.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Previsualización</span>
          <h2>Documentos embebidos</h2>
          <p>Los PDFs quedan servidos localmente desde la plataforma final para VS Code, Live Server y GitHub Pages.</p>
        </div>
        <div class="preview-grid">
          <article class="resource-card reveal">
            <h3>Matriz de Consistencia</h3>
            <iframe class="pdf-frame" src="../assets/docs/matriz-consistencia.pdf" title="Matriz de Consistencia"></iframe>
          </article>
          <article class="resource-card reveal">
            <h3>Matriz de Operacionalización</h3>
            <iframe class="pdf-frame" src="../assets/docs/matriz-operacionalizacion.pdf" title="Matriz de Operacionalización"></iframe>
          </article>
          <article class="resource-card reveal">
            <h3>Matriz de Marco Lógico</h3>
            <iframe class="pdf-frame" src="../assets/docs/matriz-marco-logico-smartrovert.pdf" title="Matriz de Marco Lógico"></iframe>
          </article>
        </div>
      </div>
    </section>`;

write("pages/matrices.html", pageShell({
  title: "Matrices",
  description: "Matrices académicas del proyecto SmartRovert integradas en una experiencia moderna y responsive.",
  eyebrow: "Matrices del proyecto",
  heroTitle: "Sistema de matrices académicas",
  heroText: "Consulta integrada de matriz de consistencia, matriz de operacionalización y matriz de marco lógico, con documentos reales preservados y tablas modernas para lectura rápida.",
  heroMetric: "3 matrices",
  heroMetricLabel: "PDFs locales integrados",
  heroId: "matrices",
  navLinks: [
    ["marco-logico.html", "Marco lógico"],
    ["metodologia.html", "Metodología"],
    ["#contenido", "Matrices"],
  ],
  tabs: [
    ["#contenido", "Matrices"],
    ["#matrices", "Inicio"],
  ],
  content: matricesContent,
}));

const methodologySteps = [
  ["01", "Análisis de involucrados", "Identifica agricultores, docentes, asesores, Universidad de Cundinamarca, comunidad agrícola y componentes tecnológicos con su expectativa, fuerza e influencia."],
  ["02", "Análisis del problema", "Define la supervisión agrícola manual y tardía como problema central, con causas técnicas, operativas y ambientales."],
  ["03", "Análisis de objetivos", "Transforma el árbol de problemas en objetivos, medios y fines orientados a monitoreo inteligente, automatización y sostenibilidad."],
  ["04", "Selección de estrategia", "Relaciona medios, acciones y alternativas tecnológicas para priorizar IoT, visión artificial y monitoreo remoto."],
  ["05", "Estructura Analítica del Proyecto", "Organiza fin, propósito, componentes y actividades en una jerarquía técnica validable."],
  ["06", "Resumen narrativo", "Redacta la lógica vertical del proyecto para conectar entregables, resultados y propósito académico."],
  ["07", "Indicadores", "Define métricas para sensores, automatización, monitoreo remoto, visión artificial y reducción de procesos manuales."],
  ["08", "Medios de verificación", "Planea reportes, evidencias fotográficas, registros, dashboard, base de datos y pruebas funcionales."],
  ["09", "Supuestos", "Evalúa riesgos tecnológicos, ambientales, sociales, financieros e institucionales que condicionan la viabilidad."],
];

const metodologiaContent = `
    <section class="section">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Ruta metodológica</span>
          <h2>Proceso de investigación y validación</h2>
          <p>La metodología se reorganizó como flujo de trabajo académico-tecnológico para que el proyecto se lea como plataforma agrotech y no como documento plano.</p>
        </div>
        <div class="method-flow">
          ${methodologySteps.map(([n, title, text]) => `<article class="method-step reveal"><span>${n}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}
        </div>
      </div>
    </section>
    <section class="section section-alt">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Evidencia metodológica</span>
          <h2>Diagramas clave</h2>
          <p>Los diagramas originales fueron migrados a la plataforma final y conectados con el flujo metodológico.</p>
        </div>
        <div class="asset-gallery">
          ${[
            ["../assets/images/marco-logico/mapa-actores.png", "Mapa de actores"],
            ["../assets/images/marco-logico/arbol-problemas.png", "Árbol de problemas"],
            ["../assets/images/marco-logico/arbol-objetivos.png", "Árbol de objetivos"],
            ["../assets/images/marco-logico/relacion-medios-acciones.png", "Relación medios-acciones"],
            ["../assets/images/marco-logico/eap-smartrovert.png", "EAP SmartRovert"],
            ["../assets/images/marco-logico/mapa-riesgos.png", "Mapa de riesgos"],
          ].map(([src, title]) => `<article class="asset-card reveal"><img src="${src}" alt="${title}"><h3>${title}</h3><div class="asset-actions"><a class="download-btn" href="${src}" target="_blank" rel="noreferrer">Abrir</a><a class="download-btn" href="${src}" download>Descargar</a></div></article>`).join("")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Control del proyecto</span>
          <h2>Indicadores, verificación y supuestos</h2>
          <p>La validación combina evidencias técnicas, registros de monitoreo, dashboard, fotografías, pruebas de sensores y análisis de riesgos.</p>
        </div>
        <div class="matrix-card-grid">
          <article class="matrix-card reveal"><span>IND</span><h3>Indicadores</h3><p>Automatización, sensores IoT, monitoreo remoto, visión artificial y reducción de procesos manuales.</p></article>
          <article class="matrix-card reveal"><span>VER</span><h3>Verificación</h3><p>Reportes técnicos, dashboard, capturas, bitácoras, base de datos y registros funcionales.</p></article>
          <article class="matrix-card reveal"><span>SUP</span><h3>Supuestos</h3><p>Conectividad, clima, recursos tecnológicos, apoyo académico y aceptación de usuarios potenciales.</p></article>
          <article class="matrix-card reveal"><span>RIE</span><h3>Riesgos</h3><p>Fallos de sensores, humedad, retrasos de materiales, conectividad y restricciones de validación.</p></article>
        </div>
      </div>
    </section>`;

write("pages/metodologia.html", pageShell({
  title: "Metodología",
  description: "Metodología del proyecto SmartRovert integrada con marco lógico, indicadores, verificación y supuestos.",
  eyebrow: "Metodología SmartRovert",
  heroTitle: "Investigación aplicada para agricultura inteligente",
  heroText: "Ruta de trabajo que conecta diagnóstico, diseño tecnológico, integración IoT, visión artificial, indicadores y validación académica.",
  heroMetric: "9 fases",
  heroMetricLabel: "De diagnóstico a supuestos",
  heroId: "metodologia",
  navLinks: [
    ["marco-logico.html", "Marco lógico"],
    ["matrices.html", "Matrices"],
    ["#contenido", "Metodología"],
  ],
  tabs: [
    ["#contenido", "Ruta"],
    ["#metodologia", "Inicio"],
  ],
  content: metodologiaContent,
}));

const docs = manifest.filter((item) => item.type === "document");
const imageGroups = {
  "Robot y prototipo": manifest.filter((item) => item.type === "image" && item.target.includes("/robot/")),
  "Marco lógico": manifest.filter((item) => item.type === "image" && item.target.includes("/marco-logico/")),
  "Recursos gráficos conservados": manifest.filter((item) => item.type === "image" && (item.target.includes("/portfolio-legacy/") || item.target.includes("/academic/"))),
  "Visuales modernos principales": manifest.filter((item) => item.type === "image" && !item.target.includes("/robot/") && !item.target.includes("/marco-logico/") && !item.target.includes("/portfolio-legacy/") && !item.target.includes("/academic/")),
};

const documentacionContent = `
    <section class="section">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Biblioteca final</span>
          <h2>Documentos integrados</h2>
          <p>Todos los PDFs, DOCX y documentos útiles quedaron organizados en <code>assets/docs</code>, con rutas relativas compatibles con GitHub Pages.</p>
        </div>
        <div class="resource-grid">
          ${docs.map((doc) => {
            const ext = path.extname(doc.target).replace(".", "").toUpperCase();
            const title = path.basename(doc.target).replace(/\.[^.]+$/, "").replace(/-/g, " ");
            return resourceCard({
              type: ext,
              title,
              text: `${doc.note}. Tamaño: ${sizeLabel(doc.bytes)}.`,
              href: `../${doc.target}`,
              secondary: doc.target.includes("/revision/") ? `<span class="download-btn is-disabled">Auditoría</span>` : "",
            });
          }).join("")}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-heading reveal">
          <span class="eyebrow">Recursos visuales</span>
          <h2>Imágenes, diagramas e iconos migrados</h2>
          <p>Todas las imágenes del proyecto secundario y los visuales modernos del frontend principal quedaron dentro de la plataforma final.</p>
        </div>
        ${Object.entries(imageGroups).map(([group, items]) => `
        <div class="section-heading compact-heading reveal">
          <h3>${group}</h3>
        </div>
        <div class="asset-gallery">
          ${items.map((item) => {
            const title = path.basename(item.target).replace(/\.[^.]+$/, "").replace(/-/g, " ");
            return `<article class="asset-card reveal"><img src="../${item.target}" alt="${title}"><h3>${title}</h3><p>${item.note}. Tamaño: ${sizeLabel(item.bytes)}.</p><div class="asset-actions"><a class="download-btn" href="../${item.target}" target="_blank" rel="noreferrer">Abrir</a><a class="download-btn" href="../${item.target}" download>Descargar</a></div></article>`;
          }).join("")}
        </div>`).join("")}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="notice-panel reveal">
          <h3>Auditoría de recuperación</h3>
          <p>Se detectó una referencia antigua a <code>assets/documentos/pechakucha.pdf</code>, pero ese archivo no existe en el proyecto secundario. Para evitar rutas rotas no se publicó como enlace activo.</p>
          <p>Las páginas secundarias <code>anteproyecto.html</code>, <code>matriz-consistencia.html</code>, <code>operacionalizacion.html</code> y <code>pechakucha.html</code> estaban vacías; el contenido recuperable se integró desde PDFs, DOCX, imágenes y <code>marco-logico.html</code>.</p>
        </div>
      </div>
    </section>`;

write("pages/documentacion.html", pageShell({
  title: "Documentación",
  description: "Biblioteca documental y visual final de SmartAgriculture con recursos integrados para producción y GitHub Pages.",
  eyebrow: "Documentación final",
  heroTitle: "Biblioteca autosuficiente SmartAgriculture",
  heroText: "Centro de consulta para PDFs, documentos editables, diagramas, imágenes del prototipo, recursos gráficos e inventario de auditoría de la fusión.",
  heroMetric: `${docs.length} docs`,
  heroMetricLabel: `${manifest.filter((item) => item.type === "image").length} imágenes integradas`,
  heroId: "documentacion",
  navLinks: [
    ["marco-logico.html", "Marco lógico"],
    ["matrices.html", "Matrices"],
    ["metodologia.html", "Metodología"],
  ],
  tabs: [
    ["#contenido", "Documentos"],
    ["#documentacion", "Inicio"],
  ],
  content: documentacionContent,
}));

const audit = `# Auditoría de fusión SmartAgriculture

## Resultado

- Plataforma final generada en la raíz de \`SmartAgricultureFusion\`.
- Frontend moderno principal conservado: hero, colores, branding, animaciones, dashboard agrícola y responsive.
- CSS antiguo de \`contenido-cristian\` no fue reutilizado.
- Assets, PDFs, DOCX, iconos e imágenes migrados a \`assets/\`.
- Páginas finales creadas: \`pages/marco-logico.html\`, \`pages/matrices.html\`, \`pages/metodologia.html\`, \`pages/documentacion.html\`.
- Inventario técnico disponible en \`assets/manifest.json\`.

## Observaciones

- \`contenido-cristian/smartrovert-ctei-main/pages/anteproyecto.html\`, \`matriz-consistencia.html\`, \`operacionalizacion.html\` y \`pechakucha.html\` estaban vacías.
- La referencia heredada \`assets/documentos/pechakucha.pdf\` no existe en el proyecto secundario; se documentó como faltante y no se dejó como enlace activo.
- \`SmartAgriculture/assets/docs/anteproyecto-smartagriculture.pdf\` y \`contenido-cristian/.../documents/anteproyecto.pdf\` son duplicados exactos por hash, por eso se conserva una sola copia PDF final.
- El archivo temporal de Word \`~$triz-marco-logico-smartrovert.docx\` se conservó en \`assets/docs/revision/\` solo para auditoría.
`;

write("AUDITORIA-FUSION.md", audit);
write("README.md", `# SmartAgricultureFusion

Plataforma final SmartAgriculture / SmartRovert lista para VS Code, Live Server y GitHub Pages.

Abrir \`index.html\` desde la raíz del proyecto o publicar la carpeta completa en GitHub Pages.

Páginas principales:

- \`index.html\`
- \`pages/marco-logico.html\`
- \`pages/matrices.html\`
- \`pages/metodologia.html\`
- \`pages/documentacion.html\`

La auditoría de migración está en \`AUDITORIA-FUSION.md\`.
`);

console.log(`Fusion site generated with ${manifest.length} migrated assets.`);

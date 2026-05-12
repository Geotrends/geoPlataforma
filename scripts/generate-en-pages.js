const fs = require('fs');
const path = require('path');

const ROOT = '/Users/geotrends/Desktop/geotrendsweb/geoPlataforma';
const htmlDir = path.join(ROOT, 'public', 'html');
const enDir = path.join(htmlDir, 'en');

const pages = [
  'index.html',
  'nosotros.html',
  'contacto.html',
  'ciudades.html',
  'industria.html',
  'blog.html',
  'blog-detalle.html',
  'politicas-privacidad.html',
  'representaciones-distribucion.html',
  'trabaja-con-nosotros.html',
];

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function addOrReplaceHeadLinks(html, esPathNoExt, enPathNoExt, ogLocale) {
  // canonical
  html = html.replace(
    /<link rel="canonical" href="https:\/\/es\.geotrends\.co\/[^"]*">/,
    `<link rel="canonical" href="https://es.geotrends.co${enPathNoExt}">`
  );
  // og:url
  html = html.replace(
    /<meta property="og:url" content="https:\/\/es\.geotrends\.co\/[^"]*">/g,
    `<meta property="og:url" content="https://es.geotrends.co${enPathNoExt}">`
  );
  // og:locale
  html = html.replace(
    /<meta property="og:locale" content="[^"]*">/g,
    `<meta property="og:locale" content="${ogLocale}">`
  );
  // inject hreflang right after canonical (if not already)
  if (!html.includes('hreflang="en"')) {
    html = html.replace(
      /(<link rel="canonical" href="https:\/\/es\.geotrends\.co[^"]*">\s*)/,
      `$1<link rel="alternate" hreflang="es" href="https://es.geotrends.co${esPathNoExt}">\n    <link rel="alternate" hreflang="en" href="https://es.geotrends.co${enPathNoExt}">\n    <link rel="alternate" hreflang="x-default" href="https://es.geotrends.co${esPathNoExt}">\n    `
    );
  }
  return html;
}

function translateCommonUI(html) {
  const replacements = [
    ['<html lang="es">', '<html lang="en">'],
    ['>Inicio<', '>Home<'],
    ['>Servicios<', '>Services<'],
    ['>Proyectos<', '>Projects<'],
    ['>Nosotros<', '>About<'],
    ['>Trabaja con nosotros<', '>Work with us<'],
    ['>Únete al equipo<', '>Join the team<'],
    ['>Contacto<', '>Contact<'],
    ['>Ciudades<', '>Cities<'],
    ['>Industria<', '>Industry<'],
    ['aria-label="Abrir menú"', 'aria-label="Open menu"'],
    ['aria-label="Cerrar panel"', 'aria-label="Close panel"'],
    ['aria-label="Cerrar"', 'aria-label="Close"'],
    ['aria-label="Anterior"', 'aria-label="Previous"'],
    ['aria-label="Siguiente"', 'aria-label="Next"'],
    ['aria-label="Buscar proyectos"', 'aria-label="Search projects"'],
    ['placeholder="Buscar proyectos..."', 'placeholder="Search projects..."'],
    ['No hay proyectos disponibles', 'No projects available'],
    ['Categoría:', 'Category:'],
    ['Año:', 'Year:'],
    ['Cliente:', 'Client:'],
    ['Descripción del proyecto', 'Project description'],
    ['Representación y Distribución', 'Representation &amp; Distribution'],
    ['ID + I', 'R&amp;D'],
    ['Ver en mapa', 'View on map'],
    ['Lunes a viernes', 'Monday to Friday'],
    ['Llamar', 'Call'],
    ['Todos los derechos reservados.', 'All rights reserved.'],
    ['Políticas de privacidad', 'Privacy Policy'],
    ['Políticas de Privacidad', 'Privacy Policy'],
    ['Servicios en Ciudades', 'Services for Cities'],
    ['Servicios en Industria', 'Services for Industry'],
    ['Mapas de ruido', 'Noise maps'],
    ['Ecosistemas WEBGIS', 'WEBGIS ecosystems'],
    ['Planes de descontaminación acústica', 'Acoustic remediation plans'],
    ['Analítica geoespacial', 'Geospatial analytics'],
    ['Control de ruido', 'Noise control'],
    ['Clasificación de fuentes', 'Source classification'],
    ['Modelación de ruido', 'Noise modeling'],
    ['Holografía acústica', 'Acoustic holography'],
    ['Medición de vibraciones', 'Vibration measurement'],
    ['Modelación de ruido subacuático', 'Underwater noise modeling'],
    ['Medición de ruido subacuático', 'Underwater noise measurement'],
    ['subacuático', 'underwater'],
    ['Fotogrametría', 'Photogrammetry'],

    // Blog / general UI
    ['Buscar en el blog', 'Search the blog'],
    ['aria-label="Buscar en el blog"', 'aria-label="Search the blog"'],
    ['aria-label="Texto de búsqueda"', 'aria-label="Search text"'],
    ['placeholder="Buscar..."', 'placeholder="Search..."'],
    ['aria-label="Buscar"', 'aria-label="Search"'],
    ['Leer más', 'Read more'],
    ['Volver al blog', 'Back to blog'],
    ['Ver proyectos', 'View projects'],

    // Footer
    ['Navegación', 'Navigation'],
    ['Ubicación', 'Location'],
    ['Correo', 'Email'],
    ['Horario', 'Hours'],
    ['Atención técnica y comercial.', 'Technical and commercial support.'],
    ['Conocer más', 'Learn more'],
    ['aria-label="Carreras"', 'aria-label="Careers"'],
    [
      'Construye soluciones en acústica, datos y territorio con un equipo que apuesta por la innovación y el impacto real.',
      'Build solutions in acoustics, data, and territory with a team committed to innovation and real impact.'
    ],
    ['¿Por qué Geotrends?', 'Why Geotrends?'],
    [
      'Trabajamos en proyectos de ciudades e industria con IoT, modelación acústica y analítica geoespacial. Valoramos la curiosidad técnica, el trabajo en equipo y la integridad.',
      'We work on city and industry projects with IoT, acoustic modeling, and geospatial analytics. We value technical curiosity, teamwork, and integrity.'
    ],
    [
      'Si compartes nuestra visión, envíanos tu CV y una breve presentación. Revisamos cada mensaje con atención.',
      'If you share our vision, send your CV and a short introduction. We review every message carefully.'
    ],
    ['Enviar candidatura', 'Send application'],
    ['aria-label="Proceso de selección"', 'aria-label="Hiring process"'],
    ['Proceso', 'Process'],
    [
      '1. Envío de CV y carta o nota breve.<br>2. Conversación inicial con el equipo.<br>3. Encuentro técnico según el rol.',
      '1. Send your CV and a short letter or note.<br>2. Introductory conversation with the team.<br>3. Technical meeting depending on the role.'
    ],
    [
      'También puedes escribirnos a <a href="mailto:info@geotrends.co" class="contacto-email-link">info@geotrends.co</a> con el asunto «Candidatura».',
      'You can also reach us at <a href="mailto:info@geotrends.co" class="contacto-email-link">info@geotrends.co</a> with the subject line “Application.”'
    ],
    ['Buscamos talento en acústica, datos e ingeniería. Envíanos tu perfil.', 'We hire talent in acoustics, data, and engineering. Send us your profile.'],

    // Página trabaja-con-nosotros (hero + carrusel)
    ['aria-label="Trabaja con nosotros"', 'aria-label="Work with us"'],
    ['aria-roledescription="carrusel"', 'aria-roledescription="carousel"'],
    ['aria-label="Vacantes abiertas"', 'aria-label="Open positions"'],
    ['aria-label="Vacante anterior"', 'aria-label="Previous opening"'],
    ['aria-label="Vacante siguiente"', 'aria-label="Next opening"'],
    [
      'role="img" aria-label="Entorno de trabajo con monitoreo ambiental, datos y desarrollo de software"',
      'role="img" aria-label="Workplace with environmental monitoring, data visualization and software development"'
    ],
    [
      '<span class="trabaja-carousel-toast__inner">No hay más vacantes en este momento.</span>',
      '<span class="trabaja-carousel-toast__inner">There are no more openings at the moment.</span>'
    ],
    [
      'Haz visible lo invisible. En Geotrends diseñamos plataformas, sensores y modelos que convierten datos ambientales y acústicos en decisiones para ciudades y para operaciones industriales.',
      'Make the invisible visible. At Geotrends we design platforms, sensors, and models that turn environmental and acoustic data into decisions for cities and industrial operations.'
    ],
    [
      'Tu trabajo puede dejar huella en territorios reales: buscamos personas con rigor técnico, curiosidad y ganas de construir soluciones con impacto medible.',
      'Your work can leave a mark on real territories: we look for people with technical rigor, curiosity, and the drive to build solutions with measurable impact.'
    ],
    [
      '<h3 class="trabaja-vacancy-title">Convocatoria inclusiva – Ingeniero/a de Desarrollo o áreas afines</h3>',
      '<h3 class="trabaja-vacancy-title">Inclusive recruitment – Software / systems / environmental engineer or related fields</h3>'
    ],
    [
      '<p class="trabaja-vacancy-front-dates" role="group" aria-label="Fechas de la convocatoria">\n                                                <span class="trabaja-vacancy-date-open"><strong>Apertura:</strong> 18:00 del 12 de mayo de 2026</span>\n                                                <span class="trabaja-vacancy-date-close"><strong>Cierre:</strong> 8:00 del 14 de mayo de 2026</span>\n                                            </p>',
      '<p class="trabaja-vacancy-front-dates" role="group" aria-label="Call timeline">\n                                                <span class="trabaja-vacancy-date-open"><strong>Opens:</strong> 12 May 2026, 6:00 p.m.</span>\n                                                <span class="trabaja-vacancy-date-close"><strong>Closes:</strong> 14 May 2026, 8:00 a.m.</span>\n                                            </p>'
    ],
    ['class="trabaja-vacancy-btn">Ver más</a>', 'class="trabaja-vacancy-btn">See more</a>'],
    [
      '¿Tienes alguna duda respecto a la vacante? Comunícate con nosotros a través de:',
      'Do you have any questions about the opening? Contact us through:'
    ],
    ['aria-label="Correo info@geotrends.co"', 'aria-label="Email info@geotrends.co"'],
    ['aria-label="LinkedIn Geotrends"', 'aria-label="Geotrends on LinkedIn"'],
    ['subject=Consulta%20sobre%20vacante"', 'subject=Question%20about%20job%20opening"'],
    ['class="trabaja-vacancy-btn trabaja-vacancy-btn--flip">Ver más</button>', 'class="trabaja-vacancy-btn trabaja-vacancy-btn--flip">See more</button>'],
    [
      'class="trabaja-vacancy-btn trabaja-vacancy-btn--ghost trabaja-vacancy-btn--unflip">Volver</button>',
      'class="trabaja-vacancy-btn trabaja-vacancy-btn--ghost trabaja-vacancy-btn--unflip">Back</button>'
    ],
    ['class="trabaja-vacancy-btn">Postularme</a>', 'class="trabaja-vacancy-btn">Apply</a>'],

    // Home — bloque únete al equipo (solo index; cadenas únicas con markup)
    ['aria-label="Carreras y equipo"', 'aria-label="Careers and team"'],
    ['aria-label="Secciones y carreras"', 'aria-label="Sections and careers"'],
    ['¿Quieres construir tecnología con nosotros?', 'Do you want to build technology with us?'],
    ['En Geotrends buscamos personas apasionadas por:', 'At Geotrends we look for people passionate about:'],
    ['<li class="home-join-tag" role="listitem">analítica geoespacial</li>', '<li class="home-join-tag" role="listitem">Geospatial analytics</li>'],
    ['<li class="home-join-tag" role="listitem">acústica</li>', '<li class="home-join-tag" role="listitem">Acoustics</li>'],
    ['<li class="home-join-tag" role="listitem">visualización de datos</li>', '<li class="home-join-tag" role="listitem">Data visualization</li>'],
    ['<li class="home-join-tag" role="listitem">IA</li>', '<li class="home-join-tag" role="listitem">AI</li>'],
    ['<li class="home-join-tag" role="listitem">software</li>', '<li class="home-join-tag" role="listitem">Software</li>'],
    ['Conoce cómo unirte', 'See how to join'],

    // Common CTAs
    ['Conoce más', 'Learn more'],
    ['Ver servicio', 'View service'],
    ['Ver más servicios', 'See more services'],

    // Home hero / sections
    ['Ingeniería Acústica y <br/>\n                Analítica Geoespacial', 'Acoustic Engineering and <br/>\n                Geospatial Analytics'],
    [
      'Somos una compañía especializada en ingeniería acústica y análisis espacial que transforma datos complejos en decisiones estratégicas. A través de nuestros ecosistemas digitales, integramos monitoreo inteligente, modelación avanzada, procesamiento de señales y analítica geoespacial para ayudar a ciudades e industrias a anticipar riesgos, optimizar su desempeño ambiental y fortalecer su reputación. No solo gestionamos el ruido: revelamos patrones invisibles en el territorio, habilitamos estrategias basadas en evidencia y posicionamos a nuestros aliados como líderes en sostenibilidad, cumplimiento y gestión inteligente del entorno.',
      'We are a company specialized in acoustic engineering and spatial analysis that transforms complex data into strategic decisions. Through our digital ecosystems, we integrate smart monitoring, advanced modeling, signal processing, and geospatial analytics to help cities and industries anticipate risks, optimize environmental performance, and strengthen their reputation. We do more than manage noise: we reveal invisible patterns across the territory, enable evidence-based strategies, and position our partners as leaders in sustainability, compliance, and smart environmental management.'
    ],
    [
      'Transformamos datos complejos en decisiones estratégicas. Soluciones de ingeniería acústica y analítica geoespacial que optimizan el desempeño ambiental y fortalecen el cumplimiento normativo.',
      'We transform complex data into strategic decisions. Acoustic engineering and geospatial analytics solutions that optimize environmental performance and strengthen regulatory compliance.'
    ],

    // Blog listing cards
    ['tendencias de data y analytics que seguiremos viendo este 2024', 'Data & analytics trends we will keep seeing in 2024'],
    ['innovaciones que transforman el mundo del análisis de datos. exploramos las tendencias que están moldeando el panorama del análisis de datos.', 'Innovations that are transforming the world of data analytics. We explore the trends shaping the data analysis landscape.'],
    ['el tesoro de los datos, estrategias prácticas para monetizar la data encabezado', 'The treasure of data: practical strategies to monetize data'],
    ['¿cómo convertir los datos en dinero? seis consejos esenciales para aprovechar al máximo el potencial de datos.', 'How do you turn data into money? Six essential tips to get the most out of your data potential.'],
    ['el valor infinito de los datos en la era de la ia', 'The infinite value of data in the age of AI'],
    ['reddit abre las puertas a google: una mirada profunda a la economía de los datos.', 'Reddit opens the door to Google: a deep look into the data economy.'],

    // Blog detail page (static UI)
    ['<!-- Contenido se carga dinámicamente según el parámetro de la URL -->', '<!-- Content loads dynamically based on the URL parameter -->'],
    ['// Contenido de los artículos', '// Article content'],
    ['// Obtener el parámetro de la URL', '// Get the URL parameter'],
    ['// Cargar el artículo correspondiente', '// Load the selected article'],

    // Blog detail article titles
    ['Innovaciones que Transforman el Mundo del Análisis de Datos', 'Innovations Transforming the World of Data Analytics'],
    ['El Tesoro de los Datos, Estrategias Prácticas para Monetizar la Data Encabezado', 'The Treasure of Data: Practical Strategies to Monetize Data'],
    ['El Valor Infinito de los Datos en la Era de la IA', 'The Infinite Value of Data in the Age of AI'],

    // Blog detail article 1 blocks
    [
      'La revolución de los datos ha llegado para quedarse, y en el vertiginoso mundo del marketing, comprender las tendencias emergentes en data y analytics es clave para mantenerse a la vanguardia. Si deseas potenciar tus estrategias de marketing este 2024, es fundamental estar al tanto de las últimas innovaciones que están moldeando el panorama del análisis de datos. Desde el procesamiento de flujos en tiempo real hasta la implementación de Edge AI, las posibilidades son infinitas. A continuación, exploramos las tendencias que están por venir en el fascinante mundo de data y analytics para lo que resta del año.',
      'The data revolution is here to stay, and in the fast-paced world of marketing, understanding emerging data and analytics trends is key to staying ahead. If you want to boost your marketing strategies in 2024, it is essential to keep up with the latest innovations shaping the data analytics landscape. From real-time stream processing to the adoption of edge AI, the possibilities are endless. Below, we explore the trends coming next in the fascinating world of data and analytics for the rest of the year.'
    ],
    ['Procesamiento de Flujos en Tiempo Real', 'Real-time Stream Processing'],
    ['El análisis de datos en tiempo real se ha vuelto esencial para muchas empresas, gracias a avances tecnológicos que permiten procesar grandes volúmenes de datos al instante, facilitando decisiones basadas en información actualizada.', 'Real-time data analytics has become essential for many companies thanks to technological advances that enable large volumes of data to be processed instantly, supporting decisions based on up-to-date information.'],
    ['IA y Machine Learning', 'AI and Machine Learning'],
    ['La inteligencia artificial (IA) y el aprendizaje automático (Machine Learning) seguirán siendo pilares en el análisis de datos este 2024, permitiendo automatizar procesos, descubrir insights profundos y anticiparse a las necesidades del mercado.', 'Artificial intelligence (AI) and machine learning will continue to be pillars of data analytics in 2024, enabling automation, deeper insights, and anticipation of market needs.'],
    ['Datos como Servicio (DaaS)', 'Data as a Service (DaaS)'],
    ['La democratización del análisis de datos se acelera con los servicios de datos en la nube (DaaS), como los ofrecidos por Google Cloud Platform y Amazon Web Services, permitiendo a empresas de todos los tamaños acceder a herramientas de análisis sin grandes inversiones.', 'The democratization of data analytics is accelerating through cloud data services (DaaS), such as those offered by Google Cloud Platform and Amazon Web Services, enabling companies of all sizes to access analytics tools without major investments.'],
    ['La gestión eficaz de datos es fundamental, y el enfoque de DataOps gana terreno al mejorar la integración, automatización y comunicación de flujos de datos, optimizando procesos de análisis y maximizando el valor de la información.', 'Effective data management is essential, and the DataOps approach is gaining traction by improving integration, automation, and communication across data flows, optimizing analytics processes and maximizing the value of information.'],
    ['Gobernanza de Datos', 'Data Governance'],
    ['La gobernanza de datos será crucial este 2024, con regulaciones más estrictas en protección de datos y la necesidad de establecer políticas claras para garantizar el manejo adecuado de la información.', 'Data governance will be crucial in 2024, with stricter data-protection regulations and the need to establish clear policies to ensure proper information handling.'],
    ['El Edge AI, al procesar datos localmente en dispositivos como sensores e IoT, permite una mayor velocidad y menor latencia, especialmente útil en sectores como la manufactura y la atención médica.', 'By processing data locally on devices such as sensors and IoT, edge AI enables higher speed and lower latency, especially useful in sectors like manufacturing and healthcare.'],
    ['La inteligencia artificial centrada en los datos extrae insights directamente de los datos, permitiendo decisiones más precisas y basadas en evidencia, lo que otorga a las empresas una ventaja competitiva en un mercado impulsado por los datos.', 'Data-centric AI extracts insights directly from data, enabling more accurate, evidence-based decisions and giving companies a competitive advantage in a data-driven market.'],
    ['Ecosistemas de Datos en la Nube', 'Cloud Data Ecosystems'],
    ['Los ecosistemas de datos en la nube integran almacenamiento, procesamiento y análisis en un entorno unificado, ofreciendo flexibilidad y escalabilidad para adaptarse a las demandas cambiantes del mercado. Se espera que su adopción siga creciendo este año, a medida que más empresas buscan aprovechar los beneficios de la transformación digital y el análisis de datos en la nube.', 'Cloud data ecosystems integrate storage, processing, and analytics in a unified environment, offering flexibility and scalability to adapt to changing market demands. Adoption is expected to continue growing this year as more companies seek the benefits of digital transformation and cloud analytics.'],
    ['En resumen, este 2024 promete ser un año emocionante para el mundo del análisis de datos, con nuevas tecnologías y tendencias que están transformando la forma en que las empresas utilizan y aprovechan sus datos. Al estar al tanto de estas tendencias emergentes, las empresas pueden prepararse para el futuro y aprovechar al máximo el potencial de sus datos para impulsar el crecimiento y la innovación.', 'In summary, 2024 promises to be an exciting year for data analytics, with new technologies and trends transforming how companies use and leverage their data. By staying on top of these emerging trends, organizations can prepare for the future and maximize the potential of their data to drive growth and innovation.'],

    // Blog detail article 2 blocks
    [
      'La explosión digital ha transformado la forma en que las empresas operan, crean valor y compiten en el mercado. Hoy en día, los datos son el activo más valioso para cualquier organización, pero ¿cómo pueden las empresas capitalizar este tesoro oculto y convertirlo en ingresos económicos tangibles?',
      'The digital explosion has transformed how companies operate, create value, and compete in the market. Today, data is the most valuable asset for any organization, but how can companies capitalize on this hidden treasure and turn it into tangible revenue?'
    ],
    [
      'En un mundo donde el Análisis de Datos impulsa la eficiencia, la innovación y el crecimiento empresarial, aprender a monetizar los datos es más crucial que nunca. Aquí presentamos seis consejos prácticos que pueden ayudar a las empresas a aprovechar al máximo su potencial de datos y convertirlos en una fuente de ingresos sostenible:',
      'In a world where data analytics drives efficiency, innovation, and business growth, learning how to monetize data is more crucial than ever. Here are six practical tips to help companies get the most out of their data potential and turn it into a sustainable source of revenue:'
    ],
    ['1. Reconocer el Valor de los Datos', '1. Recognize the Value of Data'],
    ['El primer paso para monetizar los datos es comprender su poder transformador. Los datos pueden impulsar decisiones estratégicas, mejorar procesos y desbloquear nuevas oportunidades de negocio. Al reconocer este valor, las empresas pueden comenzar a aprovechar todo el potencial de sus activos de datos.', 'The first step to monetizing data is understanding its transformative power. Data can drive strategic decisions, improve processes, and unlock new business opportunities. By recognizing this value, companies can begin to realize the full potential of their data assets.'],
    ['2. Garantizar la Calidad de los Datos', '2. Ensure Data Quality'],
    ['La calidad de los datos es fundamental para su valor monetario. Es crucial asegurarse de que los datos recopilados sean precisos, completos y estén actualizados. Los datos de alta calidad no solo benefician a la empresa, sino que también aumentan su atractivo para posibles compradores o socios colaboradores.', 'Data quality is fundamental to its monetary value. It is crucial to ensure collected data is accurate, complete, and up to date. High-quality data not only benefits the company, it also increases its attractiveness to potential buyers or partners.'],
    ['3. Cumplir con las Normativas de Privacidad', '3. Comply with Privacy Regulations'],
    ['La protección de la privacidad de los datos es esencial para generar confianza entre clientes y colaboradores. Cumplir con las normativas de privacidad no solo minimiza riesgos legales y reputacionales, sino que también fortalece la credibilidad y la integridad de la empresa.', 'Protecting data privacy is essential to build trust with customers and partners. Complying with privacy regulations not only minimizes legal and reputational risks, it also strengthens the company’s credibility and integrity.'],
    ['4. Explorar Diversas Fuentes de Ingresos', '4. Explore Diverse Revenue Streams'],
    ['La monetización de datos puede adoptar diversas formas, desde la venta directa de datos hasta la colaboración estratégica y el desarrollo de productos personalizados. Explorar diferentes fuentes de ingresos puede ayudar a diversificar financieramente la información y maximizar su valor económico.', 'Data monetization can take many forms, from direct data sales to strategic partnerships and custom product development. Exploring different revenue streams can help diversify monetization strategies and maximize the economic value of information.'],
    ['5. Priorizar la Seguridad de los Datos', '5. Prioritize Data Security'],
    ['La seguridad de los datos es fundamental para el éxito en la monetización. Invertir en tecnologías de seguridad sólidas para proteger los datos contra amenazas cibernéticas fortalece la confianza de los clientes y socios comerciales, salvaguardando así el valor de los activos de datos.', 'Data security is fundamental to successful monetization. Investing in robust security technologies to protect data from cyber threats strengthens trust with customers and business partners, safeguarding the value of data assets.'],
    ['6. Buscar Asesoría Especializada', '6. Seek Specialized Advice'],
    ['El mundo de los datos es complejo y dinámico. Buscar asesoramiento experto puede proporcionar una orientación invaluable para superar desafíos y aprovechar al máximo el potencial de monetización de los datos. Un asesoramiento especializado puede ayudar a identificar oportunidades, mitigar riesgos y optimizar estrategias de monetización de datos.', 'The data world is complex and dynamic. Expert guidance can provide invaluable direction to overcome challenges and maximize data monetization potential. Specialized advice can help identify opportunities, mitigate risks, and optimize monetization strategies.'],
    ['En conclusión, la monetización de datos representa una oportunidad de negocio sin explotar para muchas empresas. Sin embargo, el éxito en este campo requiere un enfoque estratégico y una comprensión profunda del valor y el potencial de los datos. Al seguir estos seis consejos prácticos, las empresas pueden desbloquear nuevas fuentes de ingresos y prosperar en la economía digital de la actualidad.', 'In conclusion, data monetization represents an untapped business opportunity for many companies. However, success requires a strategic approach and a deep understanding of data’s value and potential. By following these six practical tips, organizations can unlock new revenue sources and thrive in today’s digital economy.'],

    // Blog detail article 3 blocks
    [
      'En un movimiento audaz que marca un hito en la economía digital, Reddit, la conocida plataforma de agregación de noticias y foro en línea, ha anunciado sus planes de otorgar una licencia de acceso a su vasta base de datos a Google, preparándose para su oferta pública inicial (IPO). Este evento no solo resalta la trascendencia estratégica de los datos en la era de la inteligencia artificial (IA), sino que también desencadena una nueva ola en la economía de los datos, instando a las empresas a reconsiderar el valor de sus activos digitales.',
      'In a bold move marking a milestone in the digital economy, Reddit—the well-known news aggregation and online forum platform—announced plans to license access to its vast dataset to Google as it prepares for its initial public offering (IPO). This event not only highlights the strategic importance of data in the age of artificial intelligence (AI), it also triggers a new wave in the data economy, pushing companies to rethink the value of their digital assets.'
    ],
    [
      'Reddit, hogar de miles de «subreddits» que abarcan una amplia gama de temas, ha emergido como una fuente incomparable de contenido generado por usuarios en la web. Desde debates serios sobre ciencia y tecnología hasta charlas informales sobre pasatiempos y entretenimiento, este ecosistema digital ofrece una verdadera mina de datos para el entrenamiento de modelos de IA.',
      'Reddit, home to thousands of “subreddits” covering a wide range of topics, has emerged as an unparalleled source of user-generated content on the web. From serious discussions about science and technology to casual conversations about hobbies and entertainment, this digital ecosystem offers a true goldmine of data for training AI models.'
    ],
    ['Factores Clave para Capitalizar los Datos', 'Key Factors to Capitalize on Data'],
    ['Para aquellas organizaciones que buscan capitalizar sus reservas de datos, varios factores cruciales determinarán el valor de estos activos digitales. La digitalización completa y el acceso fácil a los datos son esenciales, así como la calidad y cantidad de la información. Además, la etiquetación precisa y la estructura coherente de los datos se vuelven imperativas para el desarrollo efectivo de modelos de IA.', 'For organizations looking to capitalize on their data reserves, several crucial factors will determine the value of these digital assets. Full digitization and easy access to data are essential, as well as information quality and quantity. In addition, accurate labeling and coherent structure become imperative for the effective development of AI models.'],
    ['Desafíos en la Apertura de Datos', 'Challenges in Opening Data'],
    ['Sin embargo, la apertura de datos para su uso y compartición presenta desafíos, especialmente en términos de cumplimiento legal y privacidad. Las empresas deben navegar cuidadosamente estas aguas para garantizar que el uso de sus datos cumpla con las leyes pertinentes.', 'However, opening data for use and sharing presents challenges, especially regarding legal compliance and privacy. Companies must navigate these waters carefully to ensure that data usage complies with relevant laws.'],
    ['Oportunidades para Medios y Editoriales', 'Opportunities for Media and Publishers'],
    ['Para los medios de comunicación y las editoriales, esta nueva dinámica representa una oportunidad para revaluar y monetizar sus archivos de contenido histórico. Al hacerlo, no solo pueden descubrir nuevas fuentes de ingresos, sino también contribuir al avance de la tecnología de IA, beneficiando a la sociedad en general.', 'For media and publishers, this new dynamic is an opportunity to re-evaluate and monetize historical content archives. By doing so, they can not only discover new revenue sources but also contribute to the advancement of AI technology, benefiting society as a whole.'],
    ['Un Punto de Inflexión en la Economía de los Datos', 'A Turning Point in the Data Economy'],
    ['Este caso de Reddit y Google marca un punto de inflexión en la economía de los datos, donde el verdadero valor radica en la capacidad de las organizaciones para gestionar y licenciar sus datos de manera efectiva. Así, en la era de la información, se hace evidente que la calidad y la estrategia de datos son esenciales para el éxito empresarial en el siglo XXI.', 'This Reddit–Google case marks a turning point in the data economy, where true value lies in an organization’s ability to manage and license data effectively. In the information age, it becomes clear that data quality and data strategy are essential for business success in the 21st century.'],
    ['Capitalizar la Abundancia de Información', 'Capitalizing on the Abundance of Information'],
    ['La creciente interconexión de datos y tecnología plantea preguntas fundamentales sobre cómo las empresas pueden capitalizar la abundancia de información disponible en la era digital. Con la llegada de la inteligencia artificial y el aprendizaje automático, los datos se han convertido en el activo más valioso para muchas organizaciones, ya que proporcionan información crucial para la toma de decisiones estratégicas y el desarrollo de productos y servicios más inteligentes.', 'The growing interconnection of data and technology raises fundamental questions about how companies can capitalize on the abundance of information available in the digital era. With the rise of AI and machine learning, data has become the most valuable asset for many organizations, providing crucial input for strategic decision-making and the development of smarter products and services.'],
    ['La Importancia de la Colaboración', 'The Importance of Collaboration'],
    ['El movimiento de Reddit para licenciar su base de datos a Google refleja la creciente demanda de acceso a datos de alta calidad para impulsar la innovación y el crecimiento empresarial. Este paso estratégico no solo beneficia a ambas partes involucradas, sino que también destaca la importancia de la colaboración y el intercambio de datos en la economía digital actual.', 'Reddit’s move to license its dataset to Google reflects the growing demand for access to high-quality data to drive innovation and business growth. This strategic step not only benefits both parties, it also highlights the importance of collaboration and data sharing in today’s digital economy.'],
    ['En resumen, el valor infinito de los datos radica en su capacidad para informar, inspirar y transformar. En un mundo cada vez más impulsado por los datos, las empresas que puedan aprovechar de manera efectiva estos activos digitales estarán en una posición privilegiada para liderar en la próxima era de la innovación empresarial y tecnológica.', 'In summary, the infinite value of data lies in its ability to inform, inspire, and transform. In an increasingly data-driven world, companies that can effectively leverage these digital assets will be well positioned to lead in the next era of business and technological innovation.'],

    // Privacy policy page (headings)
    ['Información que es recogida', 'Information that is collected'],
    ['Uso de la información recogida', 'Use of the collected information'],
    ['Cookies', 'Cookies'],
    ['Enlaces a Terceros', 'Links to third parties'],
    ['Control de su información personal', 'Control of your personal information'],

    // Nav panel labels (projects)
    ['Proyectos en Ciudades', 'Projects in Cities'],
    ['Proyectos en Industria', 'Projects in Industry'],

    // Service bars / labels
    ['aria-label="Servicios de Ciudades"', 'aria-label="City services"'],
    ['aria-label="Servicios de Industria"', 'aria-label="Industry services"'],

    // SEO intro paragraphs on services pages
    [
      'Servicios para ciudades: monitoreo IoT, mapas de ruido, ecosistemas WEBGIS, planes de descontaminación acústica y analítica geoespacial.',
      'Services for cities: IoT monitoring, noise maps, WEBGIS ecosystems, acoustic remediation plans, and geospatial analytics.'
    ],
    [
      'Servicios para industria: control de ruido, holografía acústica, modelación de ruido, medición de vibraciones, modelación y medición de ruido underwater, fotogrametría y analítica geoespacial.',
      'Services for industry: noise control, acoustic holography, noise modeling, vibration measurement, underwater noise modeling and measurement, photogrammetry, and geospatial analytics.'
    ],

    // City services (full descriptions)
    [
      'Implementamos redes inteligentes de monitoreo acústico basadas en sensores IoT que permiten medir, analizar y visualizar en tiempo real la condición sonora del territorio. Nuestros sistemas generan indicadores acústicos avanzados y series temporales que soportan la gestión institucional, la evaluación de políticas públicas y la toma de decisiones basadas en datos para mejorar la calidad acústica de las ciudades.',
      'We implement smart acoustic monitoring networks based on IoT sensors that measure, analyze, and visualize the sound conditions of the territory in real time. Our systems generate advanced acoustic indicators and time series that support institutional management, public policy evaluation, and data-driven decision-making to improve the acoustic quality of cities.'
    ],
    [
      'Desarrollamos mapas de ruido estratégicos utilizando modelación acústica avanzada y herramientas geoinformáticas que permiten identificar las fuentes dominantes de contaminación sonora, estimar niveles de exposición de la población y priorizar medidas de mitigación. Estos mapas se integran con instrumentos de planificación territorial y soportan procesos regulatorios y de gestión ambiental urbana.',
      'We develop strategic noise maps using advanced acoustic modeling and geoinformatics tools to identify dominant sources of noise pollution, estimate population exposure levels, and prioritize mitigation measures. These maps integrate with territorial planning instruments and support regulatory processes and urban environmental management.'
    ],
    [
      'Diseñamos ecosistemas digitales basados en plataformas WebGIS que integran múltiples fuentes de información territorial, sensores IoT y bases de datos ambientales en entornos interactivos de análisis y visualización. Nuestras plataformas permiten ingerir, procesar y analizar información georreferenciada para el monitoreo de variables ambientales, la generación de indicadores dinámicos y la visualización de capas cartográficas en tiempo real. Nuestros ecosistemas facilitan la trazabilidad de datos, el análisis espacial avanzado y la toma de decisiones estratégicas para la gestión ambiental, la planificación territorial y el fortalecimiento de capacidades institucionales.',
      'We design digital ecosystems based on WebGIS platforms that integrate multiple sources of territorial information, IoT sensors, and environmental databases into interactive analysis and visualization environments. Our platforms ingest, process, and analyze georeferenced information for monitoring environmental variables, generating dynamic indicators, and visualizing map layers in real time. These ecosystems enable data traceability, advanced spatial analysis, and strategic decision-making for environmental management, territorial planning, and strengthening institutional capabilities.'
    ],
    [
      'Formulamos planes de descontaminación acústica bajo un enfoque integral que articula diagnóstico técnico, priorización territorial y estrategias de intervención a corto, mediano y largo plazo. Nuestros planes incorporan herramientas analíticas y tecnológicas que facilitan la coordinación institucional, la trazabilidad de las acciones y la incorporación del ruido dentro de la planificación ambiental del territorio.',
      'We develop acoustic remediation plans under a comprehensive approach that combines technical diagnosis, territorial prioritization, and short-, medium-, and long-term intervention strategies. Our plans incorporate analytical and technological tools that facilitate institutional coordination, action traceability, and the integration of noise into environmental planning.'
    ],
    [
      'Aplicamos analítica geoespacial avanzada para integrar, procesar y analizar grandes volúmenes de información territorial proveniente de sensores, sistemas IoT, bases de datos geográficas y múltiples fuentes ambientales y urbanas. Mediante técnicas de análisis espacial, modelación de datos y visualización cartográfica, transformamos información georreferenciada en indicadores estratégicos que permiten identificar patrones territoriales, comprender dinámicas espaciales complejas y soportar la toma de decisiones en planificación urbana, gestión ambiental, infraestructura y desarrollo territorial.',
      'We apply advanced geospatial analytics to integrate, process, and analyze large volumes of territorial information from sensors, IoT systems, geographic databases, and multiple environmental and urban sources. Through spatial analysis techniques, data modeling, and cartographic visualization, we transform georeferenced information into strategic indicators that help identify territorial patterns, understand complex spatial dynamics, and support decision-making in urban planning, environmental management, infrastructure, and territorial development.'
    ],

    // Industry services (full descriptions)
    [
      'Implementamos sistemas IoT para el monitoreo continuo de ruido en instalaciones industriales, permitiendo caracterizar la emisión sonora de procesos productivos y evaluar su evolución en el tiempo. Estas soluciones facilitan el cumplimiento normativo, la gestión operativa del ruido y la identificación temprana de condiciones que puedan generar impactos ambientales.',
      'We implement IoT systems for continuous noise monitoring in industrial facilities, enabling characterization of sound emissions from production processes and assessment of their evolution over time. These solutions facilitate regulatory compliance, operational noise management, and early identification of conditions that may generate environmental impacts.'
    ],
    [
      'Desarrollamos soluciones de ingeniería acústica basadas en un enfoque metodológico que integra mediciones avanzadas, modelación numérica de propagación sonora, procesamiento de señal y análisis detallado de fuentes emisoras. Nuestro abordaje permite comprender con precisión la dinámica acústica de sistemas industriales complejos, identificar los mecanismos dominantes de generación y transmisión de ruido y evaluar escenarios de operación mediante simulaciones predictivas. A partir de este análisis técnico, diseñamos estrategias de optimización acústica alineadas con los requerimientos operativos, el cumplimiento normativo y la eficiencia de las intervenciones.',
      'We develop acoustic engineering solutions based on a methodological approach that integrates advanced measurements, numerical sound propagation modeling, signal processing, and detailed analysis of emitting sources. This approach enables precise understanding of the acoustic dynamics of complex industrial systems, identification of dominant noise generation and transmission mechanisms, and evaluation of operating scenarios through predictive simulations. Based on this technical analysis, we design acoustic optimization strategies aligned with operational requirements, regulatory compliance, and intervention efficiency.'
    ],
    [
      'Aplicamos técnicas de procesamiento avanzado de audio para identificar y clasificar las diferentes fuentes de ruido presentes en entornos industriales. Mediante algoritmos de etiquetado acústico es posible aislar la contribución real de los procesos productivos y diferenciarla de fuentes externas, generando diagnósticos más precisos para la gestión del impacto acústico.',
      'We apply advanced audio processing techniques to identify and classify different noise sources in industrial environments. Using acoustic labeling algorithms, we can isolate the actual contribution of production processes and distinguish it from external sources, generating more accurate diagnostics for acoustic impact management.'
    ],
    [
      'Realizamos simulaciones acústicas de alta resolución que permiten representar la propagación del ruido en entornos industriales complejos. Estos modelos integran información topográfica, infraestructura 3D y características de las fuentes para evaluar escenarios operativos, verificar cumplimiento normativo y diseñar estrategias de control de ruido basadas en evidencia técnica.',
      'We run high-resolution acoustic simulations that represent noise propagation in complex industrial environments. These models integrate topographic information, 3D infrastructure, and source characteristics to evaluate operating scenarios, verify regulatory compliance, and design noise control strategies based on technical evidence.'
    ],
    [
      'Utilizamos técnicas de holografía acústica e intensidad sonora para identificar con alta precisión las zonas de mayor emisión de ruido en maquinaria e infraestructura industrial. Esta metodología permite localizar las fuentes dominantes de ruido y optimizar el diseño de soluciones de control enfocadas en los componentes realmente críticos del sistema.',
      'We use acoustic holography and sound intensity techniques to identify, with high precision, the areas of highest noise emission in industrial machinery and infrastructure. This methodology helps locate dominant noise sources and optimize the design of control solutions focused on the truly critical components of the system.'
    ],
    [
      'Realizamos mediciones de vibración utilizando instrumentación especializada y bajo estándares internacionalmente aceptados que permite caracterizar el comportamiento dinámico de equipos industriales y estructuras. Estos estudios facilitan la identificación de problemas mecánicos, la evaluación de transmisión estructural y la prevención de daños en infraestructura o afectaciones a la operación.',
      'We perform vibration measurements using specialized instrumentation under internationally accepted standards to characterize the dynamic behavior of industrial equipment and structures. These studies facilitate mechanical issue detection, structural transmission evaluation, and prevention of infrastructure damage or operational impacts.'
    ],
    [
      'Desarrollamos modelos de propagación acústica en medios acuáticos utilizando algoritmos especializados que consideran la batimetría, las propiedades del agua y las características de las fuentes. Estos estudios permiten evaluar el alcance del impacto acústico y diseñar estrategias de mitigación para proyectos marítimos y portuarios.',
      'We develop acoustic propagation models in aquatic environments using specialized algorithms that consider bathymetry, water properties, and source characteristics. These studies assess the extent of acoustic impact and help design mitigation strategies for maritime and port projects.'
    ],
    [
      'Realizamos campañas de medición de ruido underwater mediante hidrófonos para caracterizar el impacto acústico de actividades marítimas, portuarias o de infraestructura offshore. Nuestros análisis siguen criterios internacionales y permiten evaluar la exposición acústica en ecosistemas acuáticos sensibles.',
      'We conduct underwater noise measurement campaigns using hydrophones to characterize the acoustic impact of maritime, port, or offshore infrastructure activities. Our analyses follow international criteria and enable assessment of acoustic exposure in sensitive aquatic ecosystems.'
    ],
    [
      'Aplicamos analítica geoespacial y análisis avanzado de datos para apoyar estrategias de posicionamiento de marca, comunicación y campañas con alto componente territorial. Integramos información proveniente de redes sociales, procesos de scrapping de datos abiertos, métricas digitales y variables sociodemográficas para identificar patrones de comportamiento, tendencias de conversación y dinámicas de influencia en distintos territorios. Este enfoque permite segmentar audiencias, evaluar la efectividad de estrategias en tiempo real y generar inteligencia estratégica para la toma de decisiones en campañas políticas, posicionamiento institucional y gestión de reputación digital.',
      'We apply geospatial analytics and advanced data analysis to support brand positioning, communication strategies, and campaigns with a strong territorial component. We integrate information from social networks, open-data scraping processes, digital metrics, and sociodemographic variables to identify behavior patterns, conversation trends, and influence dynamics across territories. This approach enables audience segmentation, real-time effectiveness assessment, and strategic intelligence for decision-making in political campaigns, institutional positioning, and digital reputation management.'
    ],
    [
      'Realizamos levantamientos fotogramétricos mediante drones para generar modelos tridimensionales de infraestructura y modelos digitales de terreno/superficie. Estos productos permiten construir gemelos digitales de instalaciones industriales, mejorar la precisión de los análisis técnicos y soportar procesos de ingeniería, simulación y planificación.',
      'We perform drone-based photogrammetric surveys to generate 3D infrastructure models and digital terrain/surface models. These products enable the creation of digital twins for industrial facilities, improve the accuracy of technical analyses, and support engineering, simulation, and planning processes.'
    ],

    // Privacy policy body (full text)
    [
      'La presente Política de Privacidad establece los términos en que Geotrends usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web. Esta compañía está comprometida con la seguridad de los datos de sus usuarios. Cuando le pedimos llenar los campos de información personal con la cual usted pueda ser identificado, lo hacemos asegurando que sólo se empleará de acuerdo con los términos de este documento. Sin embargo esta Política de Privacidad puede cambiar con el tiempo o ser actualizada por lo que le recomendamos y enfatizamos revisar continuamente esta página para asegurarse que está de acuerdo con dichos cambios.',
      'This Privacy Policy sets out the terms under which Geotrends uses and protects the information provided by users when using this website. This company is committed to keeping user data secure. When we ask you to fill in personal information fields by which you can be identified, we do so ensuring it will only be used in accordance with the terms of this document. However, this Privacy Policy may change over time or be updated, so we recommend and emphasize that you review this page regularly to ensure you agree with any changes.'
    ],
    [
      'Nuestro sitio web podrá recoger información personal por ejemplo: Nombre, información de contacto como su dirección de correo electrónica e información demográfica. Así mismo cuando sea necesario podrá ser requerida información específica para procesar algún pedido o realizar una entrega o facturación.',
      'Our website may collect personal information such as: name, contact information like your email address, and demographic information. Likewise, when necessary, specific information may be required to process an order or to carry out delivery or billing.'
    ],
    [
      'Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, de pedidos en caso que aplique, y mejorar nuestros productos y servicios. Es posible que sean enviados correos electrónicos periódicamente a través de nuestro sitio con ofertas especiales, nuevos productos y otra información publicitaria que consideremos relevante para usted o que pueda brindarle algún beneficio, estos correos electrónicos serán enviados a la dirección que usted proporcione y podrán ser cancelados en cualquier momento.',
      'Our website uses the information in order to provide the best possible service, particularly to maintain a record of users, orders when applicable, and to improve our products and services. Periodic emails may be sent through our site with special offers, new products, and other advertising information that we consider relevant to you or that may provide some benefit. These emails will be sent to the address you provide and may be canceled at any time.'
    ],
    [
      'Geotrends está altamente comprometido para cumplir con el compromiso de mantener su información segura. Usamos los sistemas más avanzados y los actualizamos constantemente para asegurarnos que no exista ningún acceso no autorizado.',
      'Geotrends is highly committed to keeping your information secure. We use the most advanced systems and update them constantly to ensure there is no unauthorized access.'
    ],
    [
      'Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador, al aceptar dicho fichero se crea y la cookie sirve entonces para tener información respecto al tráfico web, y también facilita las futuras visitas a una web recurrente. Otra función que tienen las cookies es que con ellas las web pueden reconocerte individualmente y por tanto brindarte el mejor servicio personalizado de su web.',
      'A cookie refers to a file that is sent in order to request permission to be stored on your computer. By accepting that file, it is created, and the cookie then serves to gather information about web traffic and also facilitates future visits to a recurring website. Another function of cookies is that they allow websites to recognize you individually and therefore provide a more personalized service.'
    ],
    [
      'Nuestro sitio web emplea las cookies para poder identificar las páginas que son visitadas y su frecuencia. Esta información es empleada únicamente para análisis estadístico y después la información se elimina de forma permanente. Usted puede eliminar las cookies en cualquier momento desde su ordenador. Sin embargo las cookies ayudan a proporcionar un mejor servicio de los sitios web, estás no dan acceso a información de su ordenador ni de usted, a menos de que usted así lo quiera y la proporcione directamente. Usted puede aceptar o negar el uso de cookies, sin embargo la mayoría de navegadores aceptan cookies automáticamente pues sirve para tener un mejor servicio web. También usted puede cambiar la configuración de su ordenador para declinar las cookies. Si se declinan es posible que no pueda utilizar algunos de nuestros servicios.',
      'Our website uses cookies to identify which pages are visited and how often. This information is used only for statistical analysis and then permanently deleted. You can delete cookies at any time from your computer. However, cookies help provide a better service on websites; they do not give access to information on your computer or about you unless you choose to provide it directly. You can accept or decline the use of cookies; however, most browsers automatically accept cookies as they help provide a better web service. You can also change your computer settings to decline cookies. If you decline them, you may not be able to use some of our services.'
    ],
    [
      'Este sitio web pudiera contener enlaces a otros sitios que pudieran ser de su interés. Una vez que usted de clic en estos enlaces y abandone nuestra página, ya no tenemos control sobre al sitio al que es redirigido y por lo tanto no somos responsables de los términos o privacidad ni de la protección de sus datos en esos otros sitios terceros. Dichos sitios están sujetos a sus propias políticas de privacidad por lo cual es recomendable que los consulte para confirmar que usted está de acuerdo con estas.',
      'This website may contain links to other sites that may be of interest to you. Once you click on these links and leave our page, we no longer have control over the site to which you are redirected, and therefore we are not responsible for the terms, privacy, or protection of your data on those third-party sites. Such sites are subject to their own privacy policies, so it is recommended that you review them to confirm that you agree with them.'
    ],
    [
      'En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestro sitio web. Cada vez que se le solicite rellenar un formulario, como el de alta de usuario, puede marcar o desmarcar la opción de recibir información por correo electrónico. En caso de que haya marcado la opción de recibir nuestro boletín o publicidad usted puede cancelarla en cualquier momento.',
      'At any time, you can restrict the collection or use of personal information provided to our website. Each time you are asked to fill out a form, such as a user registration form, you can check or uncheck the option to receive information by email. If you have checked the option to receive our newsletter or advertising, you can cancel it at any time.'
    ],
    [
      'Esta compañía no venderá, cederá ni distribuirá la información personal que es recopilada sin su consentimiento, salvo que sea requerido por un juez con un orden judicial.',
      'This company will not sell, transfer, or distribute collected personal information without your consent, unless required by a judge with a court order.'
    ],
    [
      'Geotrends Se reserva el derecho de cambiar los términos de la presente Política de Privacidad en cualquier momento.',
      'Geotrends reserves the right to change the terms of this Privacy Policy at any time.'
    ],

    // About page
    ['aria-label="Equipo"', 'aria-label="Team"'],
    ['Conoce a nuestro equipo', 'Meet our team'],
    [
      'Somos una startup especializada en acústica que integra ciencia, ingeniería y tecnología avanzada para transformar la manera en que ciudades e industrias gestionan el ruido. Combinamos monitoreo inteligente con sensores IoT, analítica geoespacial, modelación predictiva, gemelos digitales y soluciones de mitigación diseñadas a la medida para abordar desafíos acústicos de alta complejidad técnica. Hemos contribuido a la formulación y soporte de política pública y ejecutado intervenciones para infraestructura crítica bajo los más altos estándares técnicos. Nuestro enfoque conecta desempeño ambiental, cumplimiento normativo y estrategia ESG, reduciendo riesgos, fortaleciendo la trazabilidad y generando valor reputacional.',
      'We are an acoustics-focused startup that integrates science, engineering, and advanced technology to transform how cities and industries manage noise. We combine smart monitoring with IoT sensors, geospatial analytics, predictive modeling, digital twins, and tailored mitigation solutions to address acoustical challenges of high technical complexity. We have contributed to the design and support of public policy and executed interventions for critical infrastructure under the highest technical standards. Our approach connects environmental performance, regulatory compliance, and ESG strategy—reducing risk, strengthening traceability, and creating reputational value.'
    ],

    // Home page remaining strings
    ['GeoPlataforma - Ingeniería acústica y analítica geoespacial', 'GeoPlataforma - Acoustic engineering and geospatial analytics'],
    ['Acústica y análisis espacial', 'Acoustics and spatial analysis'],
    ['Portafolio De Servicios', 'Service Portfolio'],
    ['Ingeniería acústica con mediciones avanzadas y modelación predictiva.', 'Acoustic engineering with advanced measurements and predictive modeling.'],
    ['Modelación acústica avanzada para identificación de fuentes y cumplimiento normativo.', 'Advanced acoustic modeling for source identification and regulatory compliance.'],
    ['Monitoreo inteligente y gestión acústica para ciudades sostenibles.', 'Smart monitoring and acoustic management for sustainable cities.'],
    ['Analítica territorial y gestión inteligente de infraestructura crítica.', 'Territorial analytics and smart management of critical infrastructure.'],
    [
      'Medición y modelación de ruido underwater mediante hidrófonos y algoritmos de trazados de rayos para evaluación de impacto acústico.',
      'Underwater noise measurement and modeling using hydrophones and ray-tracing algorithms for acoustic impact assessment.'
    ],
    ['Analítica AI', 'AI Analytics'],
    ['Proyectos Que Transforman Territorios', 'Projects That Transform Territories'],
    [
      'Monitoreo urbano y soluciones geoespaciales para el Área Metropolitana del Valle de Aburrá mediante sistemas IoT y plataformas de información territorial.',
      'Urban monitoring and geospatial solutions for the Aburrá Valley Metropolitan Area through IoT systems and territorial information platforms.'
    ],
    ['>Privacidad<', '>Privacy<'],

    // Representation page title pieces
    ['Representación Microflown', 'Microflown Representation'],
    ['Medición y Visualización Acústica', 'Acoustic Measurement &amp; Visualization'],
    ['Representación y distribución de tecnología Microflown para medición y visualización acústica. GeoPlataforma.', 'Representation and distribution of Microflown technology for acoustic measurement and visualization. GeoPlataforma.'],
    ['Medición de Velocidad de Partículas', 'Particle Velocity Measurement'],
  ];

  const convScrollEsPath = path.join(ROOT, 'scripts', 'trabaja-conv-scroll-es.txt');
  const convScrollEnPath = path.join(ROOT, 'scripts', 'trabaja-conv-scroll-en.txt');
  if (fs.existsSync(convScrollEsPath) && fs.existsSync(convScrollEnPath)) {
    replacements.unshift([
      fs.readFileSync(convScrollEsPath, 'utf8'),
      fs.readFileSync(convScrollEnPath, 'utf8'),
    ]);
  }

  replacements.push(['subject=Convocatoria%20inclusiva"', 'subject=Inclusive%20recruitment"']);

  for (const [a, b] of replacements) {
    html = html.split(a).join(b);
  }
  return html;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function translateMeta(html) {
  const swapTitle = (from, to) => {
    html = html.replace(new RegExp(`<title>${escapeRegExp(from)}<\\/title>`), `<title>${to}</title>`);
    html = html.replace(
      new RegExp(`<meta property="og:title" content="${escapeRegExp(from)}">`, 'g'),
      `<meta property="og:title" content="${to}">`
    );
  };
  const swapDescription = (from, to) => {
    html = html.replace(
      new RegExp(`<meta name="description" content="${escapeRegExp(from)}">`),
      `<meta name="description" content="${to}">`
    );
    html = html.replace(
      new RegExp(`<meta property="og:description" content="${escapeRegExp(from)}">`, 'g'),
      `<meta property="og:description" content="${to}">`
    );
  };

  swapTitle(
    'Ingeniería Acústica, Mapas de Ruido, IoT, Holografía, Fotogrametría y Analítica Geoespacial | GeoPlataforma',
    'Acoustic Engineering, Noise Maps, IoT, Acoustic Holography, Photogrammetry and Geospatial Analytics | GeoPlataforma'
  );
  swapDescription(
    'GeoPlataforma: ingeniería acústica y analítica geoespacial. Mapas de ruido, monitoreo IoT, modelación acústica y soluciones para ciudades e industria en Colombia.',
    'GeoPlataforma: acoustic engineering and geospatial analytics. Noise maps, IoT monitoring, acoustic modeling, and solutions for cities and industry in Colombia.'
  );

  swapTitle(
    'Nosotros | Ingeniería Acústica, Mapas de Ruido, IoT y Analítica Geoespacial Colombia | GeoPlataforma',
    'About Us | Acoustic Engineering, Noise Maps, IoT and Geospatial Analytics in Colombia | GeoPlataforma'
  );
  swapDescription(
    'Conoce a GeoPlataforma: startup de base tecnológica en ingeniería acústica y análisis espacial. Medellín, Colombia.',
    'Meet GeoPlataforma: a technology-based startup in acoustic engineering and spatial analysis. Medellín, Colombia.'
  );

  swapTitle(
    'Contacto | Consultoría Acústica, Mapas de Ruido, IoT y Analítica Geoespacial | GeoPlataforma',
    'Contact | Acoustic Consulting, Noise Maps, IoT and Geospatial Analytics | GeoPlataforma'
  );
  swapDescription(
    'Contacta a GeoPlataforma. Consultoría en ingeniería acústica, mapas de ruido y analítica geoespacial. Medellín, Colombia.',
    'Contact GeoPlataforma. Consulting in acoustic engineering, noise maps, and geospatial analytics. Medellín, Colombia.'
  );

  swapTitle(
    'Trabaja con nosotros | Carreras e ingeniería acústica | GeoPlataforma',
    'Work with us | Careers and acoustic engineering | GeoPlataforma'
  );
  swapDescription(
    'Únete a Geotrends: acústica, IoT, analítica geoespacial y equipos multidisciplinarios en Medellín, Colombia.',
    'Join Geotrends: acoustics, IoT, geospatial analytics, and multidisciplinary teams in Medellín, Colombia.'
  );

  swapTitle(
    'Blog | Ingeniería Acústica, Mapas de Ruido, IoT y Analítica Geoespacial | GeoPlataforma',
    'Blog | Acoustic Engineering, Noise Maps, IoT and Geospatial Analytics | GeoPlataforma'
  );
  swapDescription(
    'Blog de GeoPlataforma: ingeniería acústica, analítica geoespacial, mapas de ruido y gestión ambiental. Artículos y novedades.',
    "GeoPlataforma's blog: acoustic engineering, geospatial analytics, noise maps, and environmental management. Articles and updates."
  );

  swapTitle('Artículo del Blog - GeoPlataforma', 'Blog Article - GeoPlataforma');
  swapDescription(
    'Artículo del blog de GeoPlataforma sobre ingeniería acústica, analítica geoespacial y gestión ambiental.',
    "GeoPlataforma blog article about acoustic engineering, geospatial analytics, and environmental management."
  );

  swapTitle('Políticas de Privacidad - GeoPlataforma', 'Privacy Policy - GeoPlataforma');
  swapDescription(
    'Políticas de privacidad y cookies de GeoPlataforma. Información sobre el tratamiento de datos y uso de cookies.',
    'GeoPlataforma privacy policy and cookies. Information about data processing and cookie usage.'
  );

  swapTitle(
    'Servicios Ciudades: IoT, Mapas de Ruido, WEBGIS, Descontaminación Acústica y Analítica Geoespacial | GeoPlataforma',
    'City Services: IoT, Noise Maps, WEBGIS, Acoustic Remediation and Geospatial Analytics | GeoPlataforma'
  );
  swapDescription(
    'Servicios en ciudades: IoT, mapas de ruido, ecosistemas WEBGIS, planes de descontaminación acústica y analítica geoespacial. GeoPlataforma.',
    'City services: IoT, noise maps, WEBGIS ecosystems, acoustic remediation plans, and geospatial analytics. GeoPlataforma.'
  );

  swapTitle(
    'Servicios Industria: Control de Ruido, Holografía Acústica, Modelación, Vibraciones, Ruido Subacuático, Fotogrametría y Analítica Geoespacial | GeoPlataforma',
    'Industry Services: Noise Control, Acoustic Holography, Modeling, Vibrations, Underwater Noise, Photogrammetry and Geospatial Analytics | GeoPlataforma'
  );
  swapTitle(
    'Servicios Industria: Control de Ruido, Holografía Acústica, Modelación, Vibraciones, Fotogrametría y Analítica Geoespacial | GeoPlataforma',
    'Industry Services: Noise Control, Acoustic Holography, Modeling, Vibrations, Photogrammetry and Geospatial Analytics | GeoPlataforma'
  );
  swapDescription(
    'Servicios en industria: control de ruido, holografía acústica, modelación, medición de vibraciones, fotogrametría y analítica geoespacial. GeoPlataforma.',
    'Industry services: noise control, acoustic holography, modeling, vibration measurement, photogrammetry, and geospatial analytics. GeoPlataforma.'
  );

  return html;
}

function pathNoExtFromPage(page) {
  const base = page.replace(/\.html$/, '');
  return base === 'index' ? '/' : `/${base}`;
}

ensureDir(enDir);

for (const page of pages) {
  const srcPath = path.join(htmlDir, page);
  const outPath = path.join(enDir, page);
  if (!fs.existsSync(srcPath)) {
    console.warn('Missing source', srcPath);
    continue;
  }
  let html = fs.readFileSync(srcPath, 'utf8');
  // Translate meta before content replacements, so exact ES strings still match.
  html = translateMeta(html);
  html = translateCommonUI(html);

  const esPath = pathNoExtFromPage(page);
  const enPath = esPath === '/' ? '/en' : `/en${esPath}`;
  html = addOrReplaceHeadLinks(html, esPath, enPath, 'en_US');

  // Titles/descriptions (light-touch)
  html = html.replace(/<title>[^<]*<\/title>/, m => {
    // keep brand, but do not over-engineer
    if (m.toLowerCase().includes('geoplataforma')) return m;
    return m;
  });

  fs.writeFileSync(outPath, html, 'utf8');
  console.log('Wrote', outPath);
}


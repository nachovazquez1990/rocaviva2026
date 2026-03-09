-- Seed home_content table with current content from translation files
-- Run this ONCE against Supabase to populate editable home content.
-- First, clear existing empty defaults:
DELETE FROM public.home_content;

INSERT INTO public.home_content (key, value_es, value_en, value_fr) VALUES

-- === HERO ===
('hero_subtitle',
 'Divulgacion cultural e historica',
 'Cultural and historical outreach',
 'Diffusion culturelle et historique'),

('hero_cta',
 'Descubre nuestros proyectos',
 'Discover our projects',
 'Decouvrez nos projets'),

-- === ABOUT ===
('about_title',
 'Quienes Somos',
 'About Us',
 'Qui Sommes-Nous'),

('about_intro',
 'Rocaviva Eventos es una empresa de divulgacion cultural especializada en la difusion de personajes historicos, fundamentalmente femeninos. Fue creada en 2005 y ha realizado exitosas exposiciones con trayectoria internacional entre las que destacan:',
 'Rocaviva Eventos is a cultural outreach company specializing in the dissemination of historical figures, primarily women. Founded in 2005, it has produced successful exhibitions with an international trajectory, among which the following stand out:',
 'Rocaviva Eventos est une entreprise de diffusion culturelle specialisee dans la mise en valeur de personnages historiques, principalement feminins. Fondee en 2005, elle a realise des expositions a succes de rayonnement international, parmi lesquelles se distinguent :'),

('about_exhibition_1',
 'Maria Sklodowska-Curie. Una polaca en Paris',
 'Maria Sklodowska-Curie. A Polish Woman in Paris',
 'Maria Sklodowska-Curie. Une Polonaise a Paris'),

('about_exhibition_2',
 'Teresa de Jesus. Corazon en Espana, alma en America',
 'Teresa de Jesus. Heart in Spain, Soul in the Americas',
 'Teresa de Jesus. Coeur en Espagne, ame en Amerique'),

('about_exhibition_3',
 'Mujeres Nobel',
 'Nobel Women',
 'Femmes Nobel'),

('about_exhibition_4',
 'Mujeres Astronautas',
 'Women Astronauts',
 'Femmes Astronautes'),

('about_projects',
 'Sus proyectos tienen un caracter global y ofrecen varias vertientes para acercar la tematica al publico desde muy diferentes entornos. Asi las exposiciones se complementan con visitas guiadas, conferencias, lecturas dramatizadas, talleres, plantaciones en jardines publicos de arboles o rosales dedicados al personaje, dedicacion de laboratorios de investigacion o nombrar calles...',
 'Its projects are global in nature and offer various approaches to bring the subject matter to the public from very different settings. Exhibitions are complemented by guided tours, conferences, dramatized readings, workshops, planting of trees or rose bushes in public gardens dedicated to the featured figure, dedication of research laboratories, or naming of streets...',
 'Ses projets ont un caractere global et offrent plusieurs approches pour rapprocher la thematique du public dans des contextes tres differents. Ainsi, les expositions sont completees par des visites guidees, des conferences, des lectures dramatisees, des ateliers, des plantations d''arbres ou de rosiers dans des jardins publics dedies au personnage, la denomination de laboratoires de recherche ou de rues...'),

('about_collaborators',
 'Entre sus colaboradores hay especialistas de reconocido prestigio internacional en diferentes ambitos como el actor Manuel Galiana, los cientificos Maria Vallet, Pierre Joliot y Helene Langevin Joliot -nietos de Marie Curie-, cantantes como el baritono Carlos Alvarez, o periodistas como Antonio Garate.',
 'Among its collaborators are internationally renowned specialists from different fields, such as the actor Manuel Galiana, the scientists Maria Vallet, Pierre Joliot and Helene Langevin Joliot — grandchildren of Marie Curie —, singers such as the baritone Carlos Alvarez, or journalists such as Antonio Garate.',
 'Parmi ses collaborateurs figurent des specialistes de prestige international reconnu dans differents domaines, tels que l''acteur Manuel Galiana, les scientifiques Maria Vallet, Pierre Joliot et Helene Langevin Joliot — petits-enfants de Marie Curie —, des chanteurs comme le baryton Carlos Alvarez, ou des journalistes comme Antonio Garate.'),

('about_nobel',
 'Entre sus acciones expositivas cabe destacar Mujeres Nobel, en la que han colaborado las propias galardonadas, sus familiares o las fundaciones que custodian sus legados, asi como el Museo Nobel de Estocolmo, el Instituto Nobel de Oslo y numerosas embajadas y universidades. Varias mujeres que han sido galardonadas con el Premio Nobel, como Elizabeth Blackburn (Nobel de Medicina 2009), May-Britt Moser (Premio Nobel de Medicina 2014) o Ouided Bouchamaoui (Premio Nobel de la Paz 2015), han acudido a inauguraciones de distintas sedes de la exposicion y han participado en actos paralelos.',
 'Among its exhibition initiatives, Nobel Women stands out, in which the laureates themselves, their families, or the foundations that safeguard their legacies have collaborated, as well as the Nobel Museum in Stockholm, the Nobel Institute in Oslo, and numerous embassies and universities. Several women who have been awarded the Nobel Prize, such as Elizabeth Blackburn (Nobel Prize in Medicine 2009), May-Britt Moser (Nobel Prize in Medicine 2014), or Ouided Bouchamaoui (Nobel Peace Prize 2015), have attended openings of various exhibition venues and participated in parallel events.',
 'Parmi ses actions d''exposition, il convient de souligner Femmes Nobel, a laquelle ont collabore les laureates elles-memes, leurs familles ou les fondations qui preservent leurs heritages, ainsi que le Musee Nobel de Stockholm, l''Institut Nobel d''Oslo et de nombreuses ambassades et universites. Plusieurs femmes laureates du Prix Nobel, comme Elizabeth Blackburn (Nobel de Medecine 2009), May-Britt Moser (Prix Nobel de Medecine 2014) ou Ouided Bouchamaoui (Prix Nobel de la Paix 2015), ont assiste a des inaugurations de differents sites de l''exposition et ont participe a des evenements paralleles.'),

('about_readings',
 'Son especialmente relevantes las lecturas dramatizadas sobre la vida de diversos personajes con absoluto rigor historico, ya que las obras estan basadas en sus propios escritos: Pierre y Marie Curie. Ellos mismos y Concha Espina. Luz y tiniebla. Las lecturas cuentan con la participacion del gran actor Manuel Galiana.',
 'Particularly noteworthy are the dramatized readings about the lives of various historical figures with absolute historical rigor, as the works are based on their own writings: Pierre and Marie Curie. Themselves and Concha Espina. Light and Darkness. The readings feature the participation of the great actor Manuel Galiana.',
 'Les lectures dramatisees sur la vie de divers personnages sont particulierement remarquables par leur rigueur historique absolue, car les oeuvres sont basees sur leurs propres ecrits : Pierre et Marie Curie. Eux-memes et Concha Espina. Lumiere et tenebres. Les lectures beneficient de la participation du grand acteur Manuel Galiana.'),

('about_yo_te_aplaudo',
 'Durante la pandemia Rocaviva organizo la exitosa campana #YoTeAplaudo en colaboracion con el Instituto de Investigacion Sanitaria del Hospital Universitario 12 de Octubre de Madrid, en la que 55 personalidades del mundo de la Ciencia, la Cultura, el Arte y el Deporte enviaron mensajes de aliento a los que arriesgaban sus vidas en primera linea.',
 'During the pandemic, Rocaviva organized the successful #YoTeAplaudo campaign in collaboration with the Health Research Institute of the 12 de Octubre University Hospital in Madrid, in which 55 personalities from the worlds of Science, Culture, Art, and Sport sent messages of encouragement to those risking their lives on the front lines.',
 'Pendant la pandemie, Rocaviva a organise la campagne a succes #YoTeAplaudo en collaboration avec l''Institut de Recherche Sanitaire de l''Hopital Universitaire 12 de Octubre de Madrid, dans laquelle 55 personnalites du monde de la Science, de la Culture, de l''Art et du Sport ont envoye des messages d''encouragement a ceux qui risquaient leur vie en premiere ligne.'),

-- === SERVICES ===
('services_title',
 'Nuestros Servicios',
 'Our Services',
 'Nos Services'),

('service_exhibitions',
 'Exposiciones Itinerantes',
 'Itinerant Exhibitions',
 'Expositions Itinerantes'),

('service_exhibitions_desc',
 'Exposiciones culturales de prestigio internacional sobre personajes historicos, con trayectoria por museos, universidades y centros culturales de todo el mundo.',
 'Internationally prestigious cultural exhibitions about historical figures, traveling through museums, universities, and cultural centers around the world.',
 'Expositions culturelles de prestige international sur des personnages historiques, presentees dans des musees, universites et centres culturels du monde entier.'),

('service_guided_tours',
 'Visitas Guiadas',
 'Guided Tours',
 'Visites Guidees'),

('service_guided_tours_desc',
 'Recorridos didacticos por las exposiciones con guias especializados que acercan al publico la vida y obra de los personajes.',
 'Educational tours of the exhibitions with specialized guides who bring the life and work of the featured figures closer to the public.',
 'Parcours didactiques des expositions avec des guides specialises qui rapprochent le public de la vie et l''oeuvre des personnages.'),

('service_conferences',
 'Conferencias',
 'Conferences',
 'Conferences'),

('service_conferences_desc',
 'Ponencias y charlas impartidas por especialistas de reconocido prestigio internacional en cada una de las tematicas.',
 'Lectures and talks given by internationally renowned specialists in each of the subject areas.',
 'Interventions et conferences donnees par des specialistes de prestige international reconnu dans chacune des thematiques.'),

('service_readings',
 'Lecturas Dramatizadas',
 'Dramatized Readings',
 'Lectures Dramatisees'),

('service_readings_desc',
 'Representaciones basadas en los propios escritos de los personajes historicos, con la participacion de actores de primer nivel.',
 'Performances based on the actual writings of historical figures, with the participation of leading actors.',
 'Representations basees sur les propres ecrits des personnages historiques, avec la participation d''acteurs de premier plan.'),

('service_workshops',
 'Talleres',
 'Workshops',
 'Ateliers'),

('service_workshops_desc',
 'Actividades educativas y talleres tematicos disenados para acercar la ciencia, la cultura y la historia a todos los publicos.',
 'Educational activities and thematic workshops designed to bring science, culture, and history to all audiences.',
 'Activites educatives et ateliers thematiques concus pour rapprocher la science, la culture et l''histoire de tous les publics.'),

('service_commemorations',
 'Acciones Conmemorativas',
 'Commemorative Actions',
 'Actions Commemoratives'),

('service_commemorations_desc',
 'Plantaciones de arboles, dedicacion de laboratorios, nomenclatura de calles y otros homenajes permanentes a los personajes.',
 'Tree plantings, laboratory dedications, street naming, and other permanent tributes to the featured figures.',
 'Plantations d''arbres, denomination de laboratoires, de rues et autres hommages permanents aux personnages.'),

-- === CONTACT ===
('contact_title',
 'Contacto',
 'Contact',
 'Contact'),

('contact_cta',
 'Organiza tu exposicion con nosotros',
 'Organize your exhibition with us',
 'Organisez votre exposition avec nous'),

('contact_button',
 'Escribenos',
 'Write to Us',
 'Ecrivez-nous'),

-- === SOCIAL ===
('social_title',
 'Siguenos',
 'Follow Us',
 'Suivez-nous');

// Data for the planets
const museumData = {
    sun: {
        title: "THE SUN",
        subtitle: "G-TYPE MAIN-SEQUENCE STAR",
        description: "The star at the center of the Solar System. It is a nearly perfect ball of hot plasma, heated to incandescence by nuclear fusion reactions in its core. The Sun radiates energy mainly as visible light, ultraviolet light, and infrared radiation, and is the most important source of energy for life on Earth.",
        basicInfo: "The Sun is the star at the center of our Solar System, primarily composed of hydrogen (73%) and helium (25%). It is a nearly perfect ball of hot plasma, heated to incandescence by nuclear fusion reactions within its core. Generating 386 billion billion megawatts of power every second, the Sun radiates energy mainly as visible light, ultraviolet light, and infrared radiation, serving as the most critical source of energy for life on Earth. Formed approximately 4.6 billion years ago from the gravitational collapse of matter within a region of a large molecular cloud, its immense gravity holds the solar system together, keeping everything from the biggest planets to the smallest particles of debris in orbit.",
        dangers: "The environment of the Sun is fundamentally lethal to any known form of matter. The core temperature exceeds 15 million degrees Celsius (27 million Fahrenheit), a heat so extreme that elements are stripped of their electrons and subjected to continuous thermonuclear fusion. At the surface, temperatures drop to roughly 5,500 degrees Celsius, but the danger shifts to violent magnetic storms that spawn solar flares and enormous Coronal Mass Ejections (CMEs). These eruptions hurl billions of tons of super-heated plasma and deadly ionizing radiation across the solar system at millions of miles per hour.",
        habitability: "The concept of habitability is entirely void when discussing a G-Type Main-Sequence Star. The Sun possesses no solid surface to land upon; it is entirely gaseous and plasmatic. Any material, biological or synthetic, engineered by modern humanity would be instantly vaporized upon approaching the corona, long before reaching the photosphere. Even probes designed strictly for solar observation, like the Parker Solar Probe, require revolutionary carbon-composite heat shields merely to survive brief passes through the outer atmosphere millions of miles away from the surface.",
        imagePath: "sun_premium_1773689127136.png",
        gallery: ["sun_surface_1773690696768.png", "sun_corona_1773690709298.png"]
    },
    mercury: {
        title: "MERCURY",
        subtitle: "THE INNERMOST PLANET",
        description: "The smallest planet in the Solar System and the closest to the Sun. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the Sun's planets. Mercury is a rocky body like Earth, but it has no significant atmosphere to retain heat.",
        basicInfo: "Mercury is the smallest planet in the Solar System and the closest to the Sun. Its orbit is highly eccentric, allowing it to speed around the Sun in just 88 Earth days at an average velocity of 29 miles per second. Due to its proximity to the star, it is tidally locked in a 3:2 spin-orbit resonance, rotating precisely three times for every two revolutions it makes around the Sun. Visually, Mercury resembles Earth’s Moon, featuring an extensively cratered surface devoid of any true atmosphere or distinct geological activity. Despite its blistering position, radar observations have discovered water ice nestled deep within permanently shadowed craters at its poles.",
        dangers: "The primary danger on Mercury is its extreme thermal volatility. Lacking an atmosphere to trap or distribute heat, the planet experiences the most extreme temperature fluctuations in the solar system. The sun-facing side is subjected to direct solar irradiation raising surface temperatures to a scorching 430°C (800°F)—hot enough to melt lead. Conversely, the dark side radiates its heat immediately into the vacuum of space, plummeting to a cryogenic -180°C (-290°F). Furthermore, without a significant magnetosphere or atmospheric shielding, the surface is perpetually relentlessly bombarded by solar wind, cosmic rays, and micrometeorites.",
        habitability: "Human habitation on Mercury is virtually impossible without continuous, massive, specialized infrastructure. An unprotected human would freeze, fry, and suffocate almost simultaneously. Some futurist models suggest underground habitats or mobile bases situated along the terminator line (the twilight zone between the sunlit and dark sides) could theoretically survive, utilizing the polar ice for water and oxygen. However, the energy requirements to maintain shielding against solar radiation and the brutal temperature differential make colonization an unfeasible prospect with current technology.",
        imagePath: "mercury_premium_1773689140406.png",
        gallery: ["mercury_surface_1773690721650.png", "mercury_angle_1773690735151.png"]
    },
    venus: {
        title: "VENUS",
        subtitle: "THE VOLCANIC HOTHOUSE",
        description: "The second planet from the Sun. It is a rocky planet with the densest atmosphere of all the rocky bodies in the Solar System, and the only one with a mass and size that is close to that of its orbital neighbour Earth.",
        basicInfo: "Venus is the second planet from the Sun and is often described as Earth\'s \"sister planet\" due to their similar size, mass, and bulk composition. However, that is where the similarities end. Venus rotates very slowly on its axis in a retrograde direction (opposite to most planets), meaning the sun rises in the west. Its surface is a hellscape of vast plains, high volcanic mountains, and massive impact craters, completely obscured by a dense, opaque layer of highly reflective clouds composed largely of sulfuric acid. This thick cloud cover traps solar energy, creating the most intense greenhouse effect known.",
        dangers: "Venus hosts the most hostile planetary surface environment in the inner solar system. The crushing atmospheric pressure at the surface is 92 times that of Earth—equivalent to the pressure found a kilometer deep in Earth\'s oceans. The runaway greenhouse effect pushed mean surface temperatures to 465°C (867°F), which is hot enough to glow dull red in the dark and melt lead and zinc. Adding to the nightmare, the atmosphere is 96.5% massive carbon dioxide, and the upper cloud decks rain continuous, concentrated sulfuric acid that vaporizes before hitting the ground.",
        habitability: "The surface of Venus guarantees immediate and catastrophic structural failure for almost anything. Even heavily armored Soviet Venera probes only survived for a maximum of 127 minutes before completely succumbing to the heat and pressure. Human habitability is entirely ruled out on the ground. However, paradoxically, about 50 kilometers up in the Venusian atmosphere, the temperature and pressure are remarkably Earth-like (1 bar and roughly 20-30°C). Concepts like NASA\'s HAVOC project propose floating aerostat habitats in this cloud layer, though inhabitants would still require absolute isolation from the corrosive sulfuric acid environment.",
        imagePath: "venus_premium_1773689153241.png",
        gallery: ["venus_surface_1773690747497.png", "venus_angle_1773690762787.png"]
    },
    earth: {
        title: "EARTH",
        subtitle: "THE PALE BLUE DOT",
        description: "The third planet from the Sun and the only astronomical object known to harbor life. According to radiometric dating and other sources of evidence, Earth formed over 4.5 billion years ago.",
        basicInfo: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. According to radiometric dating, Earth formed over 4.5 billion years ago. Earth\'s gravity interacts with other objects in space, especially the Sun and the Moon, its only natural satellite. Roughly 71% of Earth\'s surface is covered by oceans of liquid water, an essential solvent required for complex biochemical reactions. The remaining 29% is structured into continents and islands, supporting incredible biodiversity. Its atmosphere is a uniquely balanced mixture of nitrogen and free oxygen, continuously replenished by photosynthetic life.",
        dangers: "While uniquely hospitable relative to the rest of the solar system, Earth remains a highly volatile and dynamic world. Tectonic activity continuously shapes the surface, resulting in catastrophic earthquakes, volcanic eruptions, and tsunamis. Weather systems driven by solar energy and planetary rotation generate devastating hurricanes, tornadoes, and extreme temperature fluctuations. On a macro scale, Earth exists within a shooting gallery of near-Earth asteroids, relying on statistical luck and the gravitational shielding of Jupiter to avoid extinction-level impact events.",
        habitability: "Earth is the baseline for the definition of \"habitability.\" Its distance from the Sun places it perfectly within the \"Goldilocks Zone,\" allowing water to exist stably in liquid form. The active metallic core generates a robust magnetic field, the magnetosphere, which defelcts devastating solar winds and cosmic radiation. An atmospheric blanket precisely regulates surface temperatures and pressure while filtering out lethal ultraviolet light via the ozone layer. However, the fragile equilibrium of this biosphere is currently under severe threat due to the rapid, unnatural influx of greenhouse gases generated by industrial human activity.",
        imagePath: "earth_premium_1773688795438.png",
        gallery: ["earth_surface_1773690776458.png", "earth_angle_1773690788539.png"]
    },
    mars: {
        title: "MARS",
        subtitle: "THE RED PLANET",
        description: "The fourth planet from the Sun and the second-smallest planet in the Solar System. Mars is a terrestrial planet with a thin atmosphere.",
        basicInfo: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. It is frequently dubbed the \"Red Planet\" due to the prevalence of iron oxide on its surface, giving it a reddish appearance. Mars is a terrestrial planet with a thin atmosphere composed primarily of carbon dioxide. Its surface features are reminiscent of both the impact craters of the Moon and the valleys, deserts, and polar ice caps of Earth. It boasts Olympus Mons, the largest volcano and highest known mountain in the solar system, and Valles Marineris, one of the largest canyons.",
        dangers: "The Martian environment is unforgiving and completely lethal to unprotected humans. The atmospheric pressure is less than 1% of Earth\'s, meaning liquid water instantly boils away, and bodily fluids would fatally vaporize without a pressurized suit. The composition is entirely toxic, lacking breathable oxygen. Average temperatures hover around -60°C (-80°F) but can drop much lower at the poles. Crucially, Mars lost its global magnetic field billions of years ago; as a result, the surface is continuously bombarded by harsh, DNA-shredding solar and cosmic radiation.",
        habitability: "Mars represents the most realistic candidate for near-future human off-world habitation, despite its hostility. The presence of massive subsurface water ice deposits at the poles and mid-latitudes offers a crucial resource for drinking water, oxygen generation (through electrolysis), and rocket propellant manufacturing. Future colonies would likely be situated underground or heavily shielded with localized regolith to block radiation. Terraforming the planet entirely—restoring a thick atmosphere and greenhouse warming to allow surface liquid water—remains a speculative long-term theoretical goal requiring technological capabilities currently beyond our grasp.",
        imagePath: "mars_premium_1773688810242.png",
        gallery: ["mars_surface.png", "mars_angle.png"]
    },
    jupiter: {
        title: "JUPITER",
        subtitle: "THE GAS GIANT",
        description: "The fifth planet from the Sun and the largest in the Solar System.",
        basicInfo: "Jupiter is the fifth planet from the Sun and by far the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined. It is primarily composed of hydrogen with a quarter of its mass consisting of helium, though helium comprises only about a tenth of the number of molecules. Jupiter lacks a well-defined solid surface. Its most notable feature is the Great Red Spot, a colossal, persistent anticyclonic storm located south of its equator that has been raging for at least 300 years and is large enough to swallow the Earth whole.",
        dangers: "Jupiter presents an inescapable matrix of deadly phenomena. Because it is a gas giant, there is no surface to stand on; an atmospheric entry would result in a never-ending freefall through ever-thickening layers of hydrogen and helium until the extreme pressure and temperature crushed and vaporized any spacecraft. Furthermore, Jupiter\'s rapid rotation drives the most powerful magnetic field of any planet, trapping intense belts of ionizing radiation. This radiation environment is severe enough to fry heavily shielded electronics in minutes and is instantly lethal to organic life.",
        habitability: "The planet itself is fundamentally impossible to inhabit or even explore deep within using current structural paradigms due to the unimaginable pressures of its interior liquid metallic hydrogen ocean. However, scientific focus regarding habitability around Jupiter is entirely directed toward its massive Galilean moons, particularly Europa and Ganymede. These moons harbor vast, deep liquid water oceans locked beneath miles of surface ice. Heat generated by tidal flexing from Jupiter\'s immense gravity might provide enough energy for complex biochemistry to exist in these hidden abysses.",
        imagePath: "jupiter_premium_1773688823707.png",
        gallery: ["jupiter_surface.png", "jupiter_angle.png"]
    },
    saturn: {
        title: "SATURN",
        subtitle: "THE RINGED BEHEMOTH",
        description: "The sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine and a half times that of Earth.",
        basicInfo: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a massive gas giant with an average radius of about nine and a half times that of Earth, yet is the only planet in the solar system less dense than liquid water. Saturn is most famous for its stunning, complex planetary ring system, consisting extending hundreds of thousands of kilometers into space. These rings are composed primarily of billions of ice particles, with a smaller amount of rocky debris and dust, glistening brilliantly in the distant sunlight.",
        dangers: "Similar to Jupiter, Saturn is an almost impossible environment to traverse. The upper atmosphere features violent winds, reaching up to 1,800 kilometers per hour (1,100 mph)—faster than the speed of sound. Probes descending into the atmosphere face rapidly escalating pressure and temperatures, eventually meeting a crushing interior similar to Jupiter\'s metallic hydrogen core. While the radiation environment is significantly less severe than Jupiter\'s, navigating the intricate ring system presents an unrelenting hazard of high-velocity micro-meteoroid collisions that could shred an unprotected vehicle.",
        habitability: "Saturn itself cannot be inhabited, acting solely as a hostile gravitational anchor. However, it boasts an incredible system of 146 known moons, two of which are prime targets for astrobiological study. Titan, the largest moon, features a thick, nitrogen-rich atmosphere and surface lakes of liquid methane and ethane, offering a bizarre analog to an early Earth and a potential crucible for unique hydrocarbon-based life. Enceladus, a much smaller icy moon, features active cryovolcanoes shooting plumes of water, organic molecules, and salts into space, confirming the existence of a warm, habitable sub-surface ocean.",
        imagePath: "saturn_premium_1773689168077.png",
        gallery: ["saturn_surface.png", "saturn_angle.png"]
    },
    uranus: {
        title: "URANUS",
        subtitle: "THE SIDEWAYS ICE GIANT",
        description: "The seventh planet from the Sun. Its name is a reference to the Greek god of the sky, Uranus.",
        basicInfo: "Uranus is the seventh planet from the Sun. Its name is a reference to the Greek god of the sky, Uranus, who, according to Greek mythology, was the great-grandfather of Ares (Mars), grandfather of Zeus (Jupiter) and father of Cronus (Saturn). It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. Unlike the gas giants, Uranus is classified as an \"ice giant\", as its bulk composition consists predominantly of a dense fluid of \"icy\" materials—water, methane, and ammonia—wrapped around a small rocky core. Its most unique feature is its extreme axial tilt of 98 degrees, meaning it rolls around the sun essentially on its side.",
        dangers: "Uranus possesses an extremely harsh and bitterly cold environment. Its planetary troposphere is the coldest atmosphere in the solar system, with temperatures dropping to an astonishing -224°C (-371°F). The atmosphere is laced with ammonia and methane ices arranged in dense, blinding cloud decks. Exploring Uranus is complicated further by its unusual magnetic field, which is offset from the planet\'s center and tilted 59 degrees from its axis of rotation, creating an erratic, unpredictable magnetosphere that complicates orbital navigation and shielding.",
        habitability: "As a fluid ice giant with no true solid surface, Uranus offers zero prospects for traditional habitability. Any descending craft would eventually be crushed by atmospheric pressure long before reaching the hypothetical rocky core. Unlike Jupiter and Saturn, the moons of Uranus are relatively small and heavily cratered, showing fewer signs of modern geological activity or significant subsurface ocean potential with current scan resolutions. Thus, Uranus serves primarily as an extreme environment for scientific study rather than a prospective destination for biological survival.",
        imagePath: "uranus_premium_1773689180697.png",
        gallery: ["uranus_surface.png", "uranus_angle.png"]
    },
    neptune: {
        title: "NEPTUNE",
        subtitle: "THE WINDY ABYSS",
        description: "The eighth and farthest-known Solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet.",
        basicInfo: "Neptune is the eighth and farthest-known Solar planet from the Sun. It is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet. Slightly smaller than its twin Uranus, Neptune is more massive, leading to greater gravitational compression and a stark, brilliant azure blue hue derived from the absorption of red light by atmospheric methane. Orbiting at a staggering distance of 30 Astronomical Units (about 2.8 billion miles) from the Sun, it takes Neptune 165 Earth years to complete a single orbit in the cold, dim outer reaches of the system.",
        dangers: "Neptune is defined by its horrifyingly violent atmospheric dynamics. Despite its immense distance from the Sun leading to extremely low solar energy input, the planet generates massive internal heat. This powers the strongest, most supersonic winds in the entire solar system, with storms and equatorial jets clocking in at 2,100 kilometers per hour (1,300 mph). Descending into Neptune involves battling these extreme supersonic shears in complete, freezing darkness, before inevitably facing the same terminal crushing pressures inherent to all giant planets.",
        habitability: "Like all the other giant planets, Neptune provides no surface and no habitable environment for carbon-based life within its atmosphere. Its largest moon, Triton, is a strange anomaly: it orbits retrograde (backward) to Neptune\'s rotation, suggesting it was likely a dwarf planet captured from the Kuiper Belt. Triton is one of the coldest objects in the solar system (-235°C), yet it surprisingly features an active surface with geysers erupting sublimated nitrogen. While fascinating, it lacks the accessible liquid water oceans that make the moons of Jupiter and Saturn prime candidates for habitability.",
        imagePath: "neptune_premium_1773689193167.png",
        gallery: ["neptune_surface.png", "neptune_angle.png"]
    }
};

const discoveryData = {
    bennu: {
        title: "OSIRIS-REX",
        description: "NASA's OSIRIS-REx mission successfully returned a capsule to Earth containing pristine material gathered from the near-Earth asteroid Bennu. Initial analysis of the 4.5-billion-year-old sample reveals high carbon content and water, shedding light on the origins of life and our solar system.",
        placeholderStyle: "linear-gradient(45deg, #1a0b2e, #2e1a0e)",
        link: "https://science.nasa.gov/mission/osiris-rex/",
        imagePath: "osiris_rex_mission_1774922123095.png"
    },
    europa: {
        title: "EUROPA CLIPPER",
        description: "NASA's Europa Clipper mission is designed to conduct detailed reconnaissance of Jupiter's moon Europa and investigate whether the icy moon could harbor conditions suitable for life. It will perform dozens of close flybys, utilizing advanced instruments to scan the massive subsurface ocean hidden beneath its ice shell.",
        placeholderStyle: "linear-gradient(45deg, #0b1a2e, #1a2e3a)",
        link: "https://europa.nasa.gov/",
        imagePath: "europa_clipper_mission_1774922140557.png"
    },
    psyche: {
        title: "PSYCHE MISSION",
        description: "The Psyche mission is journeying to a unique metal-rich asteroid of the same name orbiting the Sun between Mars and Jupiter. Scientists believe the asteroid may be the exposed partial core of a shattered planetesimal, offering a unique window into the violent history of collisions and accretion that created terrestrial planets.",
        placeholderStyle: "linear-gradient(45deg, #2e100e, #3a150b)",
        link: "https://science.nasa.gov/mission/psyche/",
        imagePath: "psyche_asteroid_mission_1774922157450.png"
    }
};

const craftData = {
    satellite: {
        title: "ORBITING SATELLITES",
        icon: "fa-satellite",
        description: "Earth observation satellites continually monitor our planet's health, weather systems, and climate change. Recent advancements in sensor suites allow us to track everything from greenhouse gas emissions to the health of global agriculture yields with unprecedented precision.",
        label1: "Active Orbiters",
        stat1: "Over 8,000",
        label2: "Notable Example",
        stat2: "Hubble Telescope"
    },
    probe: {
        title: "DEEP SPACE PROBES",
        icon: "fa-satellite-dish",
        description: "Deep space probes venture far beyond Earth orbit, venturing into the outer extremes of our solar system and beyond. Triumphs like the OSIRIS-REx mission returning samples from asteroid Bennu provide pristine material from the early solar system.",
        label1: "Farthest Human Object",
        stat1: "Voyager 1",
        label2: "Notable Example",
        stat2: "Juno (Jupiter)"
    },
    rover: {
        title: "AUTOMATED ROVERS",
        icon: "fa-robot",
        description: "Robotic terrestrial explorers navigate alien terrain. NASA's Perseverance rover is currently caching rock samples on Mars for future return to Earth, all while producing oxygen from the Martian atmosphere using the MOXIE instrument.",
        label1: "Current Focus",
        stat1: "Jezero Crater",
        label2: "Notable Example",
        stat2: "Perseverance"
    },
    rocket: {
        title: "LAUNCH VEHICLES",
        icon: "fa-rocket",
        description: "Heavy-lift supply rockets are the backbone of space exploration. The recent successful flights of NASA's Space Launch System (SLS) and commercial super heavy rockets are paving the way for the Artemis missions to physically return mankind to the Moon.",
        label1: "Main Capability",
        stat1: "Heavy Lift",
        label2: "Notable Example",
        stat2: "Artemis SLS"
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // --- Timeline Interaction ---
    const timelineItems = document.querySelectorAll('.timeline-item');
    const planetTitle = document.getElementById('planetTitle');
    const planetDescription = document.getElementById('planetDescription');
    const planetImage = document.getElementById('planetImage');
    
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all
            timelineItems.forEach(el => el.classList.remove('active'));
            
            // Add active class to clicked
            this.classList.add('active');
            
            // Get data for selected planet
            const planetKey = this.getAttribute('data-planet');
            sessionStorage.setItem('activePlanet', planetKey);

            if (museumData[planetKey]) {
                const data = museumData[planetKey];
                
                // Animate change (simple opacity fade)
                planetTitle.style.opacity = 0;
                planetDescription.style.opacity = 0;
                if(planetImage) planetImage.style.opacity = 0;
                
                setTimeout(() => {
                    planetTitle.textContent = data.title;
                    planetDescription.textContent = data.description;
                    if(planetImage && data.imagePath) {
                        planetImage.src = data.imagePath;
                        planetImage.alt = data.title + " from Space";
                    }
                    
                    const exploreBtn = document.getElementById('exploreBtn');
                    if (exploreBtn) exploreBtn.href = "artifact.html?id=" + planetKey;
                    
                    planetTitle.style.transition = 'opacity 0.5s ease';
                    planetDescription.style.transition = 'opacity 0.5s ease';
                    if(planetImage) planetImage.style.transition = 'opacity 0.5s ease';
                    
                    planetTitle.style.opacity = 1;
                    planetDescription.style.opacity = 1;
                    if(planetImage) planetImage.style.opacity = 1;
                }, 300);
            }
        });
    });

    // Initialize state from sessionStorage or default to 'sun'
    const savedPlanet = sessionStorage.getItem('activePlanet') || 'sun';
    const targetItem = document.querySelector(`.timeline-item[data-planet="${savedPlanet}"]`);
    if (targetItem) {
        // Trigger click to initialize content and active states
        targetItem.click();
    } else if (planetImage) {
        planetImage.src = museumData.sun.imagePath;
    }

    // --- Accordion Interaction ---
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Toggle active state on the clicked button's parent
            const parentItem = this.parentElement;
            const content = this.nextElementSibling;
            const icon = this.querySelector('span');
            
            // Allow multiple accordions to be open, or close others
            // Let's implement standard toggle for the one clicked
            
            if (parentItem.classList.contains('active')) {
                parentItem.classList.remove('active');
                content.style.display = 'none';
                if(icon) icon.textContent = '+';
            } else {
                parentItem.classList.add('active');
                content.style.display = 'block';
                if(icon) icon.textContent = '-';
            }
        });
    });

    // --- Discovery Interaction ---
    const discoveryItems = document.querySelectorAll('.discovery-item');
    const discoveryTitle = document.getElementById('discoveryTitle');
    const discoveryDescription = document.getElementById('discoveryDescription');
    const discoveryPlaceholder = document.getElementById('discoveryImagePlaceholder');
    const discoveryImage = document.getElementById('discoveryImage');

    if (discoveryImage && discoveryData.bennu) {
        // Initialize Bennu image
        discoveryImage.src = discoveryData.bennu.imagePath;
        discoveryImage.style.display = 'block';
        if(discoveryPlaceholder) discoveryPlaceholder.style.display = 'none';
    }

    discoveryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all
            discoveryItems.forEach(el => el.classList.remove('active'));
            
            // Add active class to clicked
            this.classList.add('active');
            
            // Get data for selected discovery
            const discKey = this.getAttribute('data-discovery');
            if (discoveryData[discKey]) {
                const data = discoveryData[discKey];
                
                // Animate change
                if(discoveryTitle) discoveryTitle.style.opacity = 0;
                if(discoveryDescription) discoveryDescription.style.opacity = 0;
                if(discoveryPlaceholder) discoveryPlaceholder.style.opacity = 0;
                if(discoveryImage && discoveryImage.style.display !== 'none') discoveryImage.style.opacity = 0;
                
                setTimeout(() => {
                    if(discoveryTitle) {
                        discoveryTitle.textContent = data.title;
                        discoveryTitle.style.transition = 'opacity 0.5s ease';
                        discoveryTitle.style.opacity = 1;
                    }
                    if(discoveryDescription) {
                        discoveryDescription.textContent = data.description;
                        discoveryDescription.style.transition = 'opacity 0.5s ease';
                        discoveryDescription.style.opacity = 1;
                    }
                    
                    if(discoveryPlaceholder) {
                        discoveryPlaceholder.style.display = 'none'; // Hide placeholder
                    }

                    if(discoveryImage) {
                        discoveryImage.src = data.imagePath;
                        discoveryImage.style.display = 'block'; // Show real image
                        discoveryImage.style.transition = 'opacity 0.5s ease';
                        discoveryImage.style.opacity = 1;
                    }
                    
                    const discoveryLink = document.getElementById('discoveryLink');
                    if (discoveryLink) {
                        discoveryLink.href = data.link;
                    }
                }, 300);
            }
        });
    });

    // --- Spacecraft Modal Interaction ---
    const craftIcons = document.querySelectorAll('.craft-icon-wrap');
    const modalOverlay = document.getElementById('craftModal');
    
    if (modalOverlay) {
        const closeModalBtn = document.getElementById('closeModal');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalStatLabel1 = document.getElementById('modalStatLabel1');
        const modalStat1 = document.getElementById('modalStat1');
        const modalStatLabel2 = document.getElementById('modalStatLabel2');
        const modalStat2 = document.getElementById('modalStat2');

        // Open Modal
        craftIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                const craftType = icon.getAttribute('data-craft');
                const data = craftData[craftType];
                
                if (data) {
                    modalIcon.className = `fa-solid ${data.icon}`;
                    modalTitle.textContent = data.title;
                    modalDescription.textContent = data.description;
                    
                    modalStatLabel1.textContent = data.label1;
                    modalStat1.textContent = data.stat1;
                    
                    modalStatLabel2.textContent = data.label2;
                    modalStat2.textContent = data.stat2;
                    
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            });
        });

        // Close Modal via Button
        closeModalBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close Modal via Click Outside
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    // --- Dynamic Space Background ---
    function initSpaceBackground() {
        const bg = document.createElement('div');
        bg.id = 'space-background';
        document.body.appendChild(bg); // Append to body so it wraps entirely

        // Initial batch of asteroids/comets
        for(let i=0; i<40; i++) {
            createAsteroid(bg);
        }
        
        // Continuously spawn new ones to keep the background alive
        setInterval(() => createAsteroid(bg), 1500);

        // Shooting star exactly every 6 seconds
        setInterval(() => createShootingStar(bg), 6000);
    }

    function createAsteroid(container) {
        const isComet = Math.random() > 0.85; // 15% chance to be a FontAwesome comet icon
        const ast = document.createElement('div');
        ast.classList.add('asteroid');
        
        if (isComet) {
            ast.innerHTML = '<i class="fa-solid fa-meteor"></i>';
            ast.style.fontSize = (Math.random() * 8 + 8) + 'px'; // 8px to 16px
            ast.style.color = 'rgba(255, 255, 255, 0.3)';
            ast.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.5)';
        } else {
            const size = Math.random() * 3 + 1; // 1px to 4px
            ast.style.width = size + 'px';
            ast.style.height = size + 'px';
            ast.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            ast.style.borderRadius = '50%';
        }
        
        // Start position: heavily skewed to the right side and top so it can drift diagonally down-left across the screen
        ast.style.left = (Math.random() * 150 + 20) + 'vw'; 
        ast.style.top = (Math.random() * 50 - 50) + 'vh'; // start up to 50vh above screen
        
        // Random drift duration
        const duration = Math.random() * 30 + 15; // 15s to 45s
        ast.style.animationDuration = duration + 's';
        
        container.appendChild(ast);
        
        // Clean up DOM after animation completes
        setTimeout(() => {
            if(ast.parentNode) ast.remove();
        }, duration * 1000);
    }

    function createShootingStar(container) {
        const star = document.createElement('div');
        star.classList.add('shooting-star');
        
        // Random start position (top/right quadrant)
        star.style.left = (Math.random() * 80 + 20) + 'vw';
        star.style.top = (Math.random() * 40 - 10) + 'vh';
        
        container.appendChild(star);
        
        // Remove after animation completes (1.2s)
        setTimeout(() => {
            if(star.parentNode) star.remove();
        }, 1200);
    }
    
    // Initialize the background overlay
    initSpaceBackground();

    // --- Artifact Page Logic ---
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) { // We are on artifact.html
        const urlParams = new URLSearchParams(window.location.search);
        const planetId = urlParams.get('id');
        
        if (planetId && museumData[planetId]) {
            const data = museumData[planetId];
            
            pageTitle.textContent = data.title;
            const subtitleEl = document.getElementById('pageSubtitle');
            if (subtitleEl) subtitleEl.textContent = data.subtitle || "CLASSIFIED CELESTIAL BODY";
            
            const detailHeroImage = document.getElementById('detailHeroImage');
            if (detailHeroImage) {
                detailHeroImage.src = data.imagePath;
                detailHeroImage.alt = data.title;
            }
            
            const pBasic = document.getElementById('detailBasicInfo');
            if (pBasic) pBasic.textContent = data.basicInfo;
            
            const pDangers = document.getElementById('detailDangers');
            if (pDangers) pDangers.textContent = data.dangers;
            
            const pHab = document.getElementById('detailHabitability');
            if (pHab) pHab.textContent = data.habitability;
            
            const g1 = document.getElementById('galleryImg1');
            if (g1 && data.gallery[0]) {
                g1.src = data.gallery[0];
                g1.alt = data.title + " Extra View 1";
            }
            
            const g2 = document.getElementById('galleryImg2');
            if (g2 && data.gallery[1]) {
                g2.src = data.gallery[1];
                g2.alt = data.title + " Extra View 2";
            }
        } else {
            const pBasic = document.getElementById('detailBasicInfo');
            if (pBasic) pBasic.textContent = "Error: Artifact data not found or corrupted.";
        }
    }
});

// =========================================
// ROCKET LAUNCH TRANSITION LOGIC
// =========================================
function setupRocketTransition() {
    // Select both the nav link and the button
    const virtualLinks = document.querySelectorAll('a[href*="Planetariam Museum/index.html"]');
    const transitionOverlay = document.getElementById('rocket-transition');

    if (!transitionOverlay) return;

    virtualLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Stop immediate navigation
            const targetUrl = this.href;

            // Remove hidden to put it in DOM
            transitionOverlay.classList.remove('hidden');
            
            // Force reflow
            void transitionOverlay.offsetWidth;

            // Trigger animation
            transitionOverlay.classList.add('active');

            // Wait for fly-up animation and smoke to fully engulf the screen before redirecting
            // Blast off takes 2s (starts at 0.8s delay). 
            // Smoke expansion takes 3.5 seconds to hit scale(15) white-out. Total time = 3.5 seconds maximum.
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 3500); 
        });
    });
}

// Since DOMContentLoaded already fired for the main file, 
// we call it safely here if it's already loaded, or attach it.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupRocketTransition);
} else {
    setupRocketTransition();
}

import { type Locale } from './i18n'

type BaseLocale = 'en' | 'fr' | 'es' | 'pt-br' | 'de'
type AutoLocale = Exclude<Locale, BaseLocale>

export type LocaleTextMap<T> = Record<BaseLocale, T> & Partial<Record<AutoLocale, T>>

const NON_TRANSLATABLE_KEYS = new Set([
    'value',
    'id',
    'slug',
    'href',
    'url',
    'locale',
    'type',
    'version',
    'query-input'
])

const EXACT_TRANSLATIONS: Record<AutoLocale, Record<string, string>> = {
    it: {
        'Home': 'Home',
        'Contact': 'Contatto',
        'About': 'Chi siamo',
        'Account': 'Account',
        'My account': 'Il mio account',
        'Sign in': 'Accedi',
        'Create account': 'Crea account',
        'Username': 'Nome utente',
        'Your username': 'Il tuo nome utente',
        'Password': 'Password',
        'Submitting...': 'Invio...',
        'Authentication failed': 'Autenticazione fallita',
        'Network error, please try again': 'Errore di rete, riprova',
        'Try again': 'Riprova',
        'Sign in | PMarketplace': 'Accedi | PMarketplace',
        'Sign in to manage your PocketMine plugin purchases.':
            'Accedi per gestire i tuoi acquisti di plugin PocketMine.',
        'Welcome back': 'Bentornato',
        'Sign in to access your purchases and downloads.':
            'Accedi per vedere i tuoi acquisti e download.',
        'Why sign in': 'Perché accedere',
        'Manage licenses, download updates, and keep your PocketMine plugins organized.':
            'Gestisci licenze, scarica aggiornamenti e tieni organizzati i plugin PocketMine.',
        'Account preview': 'Anteprima account',
        'Cart': 'Carrello',
        'Cart | PMarketplace': 'Carrello | PMarketplace',
        'Your cart': 'Il tuo carrello',
        'Your cart is empty.': 'Il tuo carrello è vuoto.',
        'Order summary': 'Riepilogo ordine',
        'Total': 'Totale',
        'Continue to checkout': 'Continua al checkout',
        'Keep shopping': 'Continua a comprare',
        'Checkout': 'Checkout',
        'Checkout | PMarketplace': 'Checkout | PMarketplace',
        'Checkout form': 'Modulo checkout',
        'Secure checkout': 'Checkout sicuro',
        'Fast purchase, instant access.': 'Acquisto rapido, accesso immediato.',
        'Complete purchase': 'Completa acquisto',
        'Checkout failed': 'Checkout non riuscito',
        'Try again in a moment.': 'Riprova tra un momento.',
        'Order created': 'Ordine creato',
        'Full name': 'Nome completo',
        'Your name': 'Il tuo nome',
        'PocketMine server': 'Server PocketMine',
        'Server name or IP': 'Nome server o IP',
        'Order notes': "Note dell'ordine",
        'Anything we should know?': 'Qualcosa che dovremmo sapere?',
        'Add a plugin to your cart to checkout.':
            'Aggiungi un plugin al carrello per procedere al checkout.',
        'Back to cart': 'Torna al carrello',
        'Please sign in to continue checkout.':
            'Accedi per continuare il checkout.',
        'Checkout preview': 'Anteprima checkout',
        'Access details are delivered instantly after payment.':
            "I dettagli di accesso vengono consegnati subito dopo il pagamento.",
        'About PMarketplace | PocketMine Plugin Marketplace':
            'Informazioni su PMarketplace | Marketplace plugin PocketMine',
        'About': 'Chi siamo',
        'Built for serious PocketMine servers.':
            'Progettato per server PocketMine professionali.',
        'Our mission': 'La nostra missione',
        'What we value': 'I nostri valori',
        'Contact | PMarketplace': 'Contatto | PMarketplace',
        'PMarketplace support': 'Supporto PMarketplace',
        'Contact form': 'Modulo di contatto',
        'Name': 'Nome',
        'Topic': 'Argomento',
        'General question': 'Domanda generale',
        'Plugin catalog': 'Catalogo plugin',
        'Custom build': 'Sviluppo personalizzato',
        'Message': 'Messaggio',
        'Send message': 'Invia messaggio',
        'Download catalog': 'Scarica catalogo',
        'Search': 'Cerca',
        'Tag': 'Tag',
        'Price': 'Prezzo',
        'All tags': 'Tutti i tag',
        'All prices': 'Tutti i prezzi',
        'All versions': 'Tutte le versioni',
        'Apply filters': 'Applica filtri',
        'Plugin catalog': 'Catalogo plugin',
        'All PocketMine plugins': 'Tutti i plugin PocketMine',
        'PocketMine Plugins (Free & Premium) | PMarketplace':
            'Plugin PocketMine (Gratis e Premium) | PMarketplace',
        'PocketMine Plugins Catalog': 'Catalogo plugin PocketMine',
        'PocketMine Plugin Not Found | PMarketplace':
            'Plugin PocketMine non trovato | PMarketplace',
        'Plugins': 'Plugin',
        'Add to cart': 'Aggiungi al carrello',
        'Added': 'Aggiunto',
        'Remove': 'Rimuovi',
        'Removing...': 'Rimozione...',
        'Failed to remove item': "Impossibile rimuovere l'articolo",
        'Failed to add to cart': 'Impossibile aggiungere al carrello',
        'Buy now': 'Acquista ora',
        'Processing...': 'Elaborazione...',
        'Already purchased': 'Già acquistato',
        'Already owned': 'Già posseduto',
        'Owned': 'Posseduto',
        'Purchase failed': "Acquisto non riuscito",
        'Try again shortly.': 'Riprova tra poco.',
        'Go to my account': 'Vai al mio account',
        'Sign in to buy': 'Accedi per acquistare',
        'Plugin already owned.': 'Plugin già posseduto.',
        'Free': 'Gratis',
        'Custom': 'Personalizzato',
        'Featured': 'In evidenza',
        'View details': 'Vedi dettagli',
        'Premium PocketMine plugin.': 'Plugin PocketMine premium.',
        'Full description': 'Descrizione completa',
        'Changelog': 'Registro modifiche',
        'No changelog provided.': 'Nessun changelog fornito.',
        'No versions available yet.': 'Nessuna versione disponibile.',
        'No releases yet.': 'Nessuna release disponibile.',
        'Latest': 'Ultima',
        'Past': 'Precedente',
        'Download': 'Scarica',
        'Download PDF': 'Scarica PDF',
        'Orders': 'Ordini',
        'Licenses': 'Licenze',
        'No orders yet.': 'Nessun ordine.',
        'No licenses yet.': 'Nessuna licenza.',
        'Issued': 'Emessa',
        'License active': 'Licenza attiva',
        'View plugin': 'Vedi plugin',
        'PocketMine release': 'Versione PocketMine',
        'Order confirmed': 'Ordine confermato',
        'Order confirmed | PMarketplace': 'Ordine confermato | PMarketplace',
        'Thanks for your purchase': "Grazie per l'acquisto",
        'Keep browsing': 'Continua a esplorare',
        'My account': 'Il mio account',
        'Unable to sign out': 'Impossibile uscire',
        'Signing out...': 'Uscita...',
        'Sign out': 'Esci',
        'Hide license': 'Nascondi licenza',
        'See license': 'Vedi licenza',
        'Ready to launch': 'Pronto a partire',
        'Start shopping': 'Inizia ora',
        'View cart': 'Vedi carrello',
        'Browse plugins': 'Esplora plugin',
        'See benefits': 'Vedi vantaggi',
        'Free & Premium PocketMine Plugins for Bedrock Servers | PMarketplace':
            'Plugin PocketMine Gratis e Premium per server Bedrock | PMarketplace',
        'PocketMine Plugins for Minecraft Bedrock Servers':
            'Plugin PocketMine per server Minecraft Bedrock',
        'Get free and premium PocketMine plugins that just work.':
            'Ottieni plugin PocketMine gratis e premium che funzionano davvero.',
        'Security Essentials Pack': 'Pacchetto Sicurezza Essenziale',
        'Hardened permissions, safe configs, and logs.':
            'Permessi rinforzati, configurazioni sicure e log.',
        'Featured PocketMine plugin': 'Plugin PocketMine in evidenza',
        'Top PocketMine plugins right now.':
            'I migliori plugin PocketMine del momento.',
        'Shop free and premium PocketMine-MP plugins for Minecraft Bedrock servers. PMarketplace helps server owners find high-quality plugins for economy, factions, moderation, performance, and gameplay.':
            'Acquista plugin PocketMine-MP gratuiti e premium per server Minecraft Bedrock. PMarketplace aiuta i proprietari di server a trovare plugin di alta qualità per economia, fazioni, moderazione, performance e gameplay.',
        'Shop free and premium PocketMine-MP plugins for Minecraft Bedrock servers.':
            'Acquista plugin PocketMine-MP gratuiti e premium per server Minecraft Bedrock.',
        'Browse free and premium PocketMine plugins for Minecraft Bedrock servers.':
            'Scopri plugin PocketMine gratuiti e premium per server Minecraft Bedrock.',
        'Browse free and premium PocketMine plugins for Minecraft Bedrock servers on PMarketplace.':
            'Scopri plugin PocketMine gratuiti e premium per server Minecraft Bedrock su PMarketplace.',
        'Do you offer free PocketMine plugins?':
            'Offrite plugin PocketMine gratuiti?',
        'Yes. PMarketplace includes both free and premium PocketMine plugins for Minecraft Bedrock servers.':
            'Sì. PMarketplace include sia plugin PocketMine gratuiti che premium per server Minecraft Bedrock.',
        'Are PMarketplace plugins made for PocketMine-MP servers?':
            'I plugin PMarketplace sono pensati per server PocketMine-MP?',
        'Yes. PMarketplace focuses on PocketMine-MP plugins built for modern Minecraft Bedrock server communities.':
            'Sì. PMarketplace si concentra su plugin PocketMine-MP progettati per community moderne di server Minecraft Bedrock.',
        'Learn how PMarketplace helps the PocketMine community find free and premium plugins for Minecraft Bedrock servers.':
            'Scopri come PMarketplace aiuta la community PocketMine a trovare plugin gratuiti e premium per server Minecraft Bedrock.',
        'PMarketplace helps Minecraft Bedrock server owners find secure, reliable, and maintainable PocketMine-MP plugins.':
            'PMarketplace aiuta i proprietari di server Minecraft Bedrock a trovare plugin PocketMine-MP sicuri, affidabili e facili da mantenere.',
        'Help the PocketMine community access both free and premium plugins that keep Bedrock servers stable and communities growing.':
            'Aiutare la community PocketMine ad accedere a plugin gratuiti e premium che mantengono stabili i server Bedrock e fanno crescere le community.',
        'Security, long-term reliability, and plugin quality that supports real-world PocketMine-MP operations.':
            'Sicurezza, affidabilità a lungo termine e qualità dei plugin per operazioni PocketMine-MP reali.',
        'Contact PMarketplace for PocketMine-MP plugin questions, free and premium plugin recommendations, and Minecraft Bedrock server support.':
            'Contatta PMarketplace per domande sui plugin PocketMine-MP, consigli su plugin gratuiti e premium e supporto per server Minecraft Bedrock.',
        'Let’s build your next plugin.':
            'Costruiamo il tuo prossimo plugin.',
        'Short questions, fast answers, and a clear path to delivery for your PocketMine-MP Minecraft Bedrock server.':
            'Domande brevi, risposte rapide e un percorso chiaro verso la consegna per il tuo server PocketMine-MP Minecraft Bedrock.',
        'We help PocketMine server owners choose the right free or premium plugins, or ship custom work quickly.':
            'Aiutiamo i proprietari di server PocketMine a scegliere i plugin gratuiti o premium giusti, oppure a consegnare sviluppo personalizzato rapidamente.',
        'Tell us about your server and goals.':
            'Parlaci del tuo server e dei tuoi obiettivi.',
        'Review your PocketMine-MP plugin selections before checkout.':
            'Controlla la tua selezione di plugin PocketMine-MP prima del checkout.',
        'Complete your PocketMine-MP plugin purchase securely.':
            'Completa il tuo acquisto di plugin PocketMine-MP in modo sicuro.',
        'Track orders, licenses, downloads, and changelogs.':
            'Tieni traccia di ordini, licenze, download e changelog.',
        'Download any version that belongs to your license.':
            'Scarica qualsiasi versione inclusa nella tua licenza.',
        'Download a PDF proof for accounting or support.':
            'Scarica una ricevuta PDF per contabilità o supporto.',
        'Each license proves you own the plugin and unlocks downloads.':
            'Ogni licenza dimostra la proprietà del plugin e sblocca i download.',
        'Your PocketMine plugin order has been confirmed.':
            'Il tuo ordine di plugin PocketMine è stato confermato.',
        'Your plugins are now available in your account, including all versions and downloads.':
            'I tuoi plugin sono ora disponibili nel tuo account, incluse tutte le versioni e i download.',
        'Discover free and paid PocketMine-MP plugins for Minecraft Bedrock servers, from economy systems to moderation and minigames.':
            'Scopri plugin PocketMine-MP gratuiti e a pagamento per server Minecraft Bedrock, dai sistemi economia alla moderazione e ai minigiochi.',
        'Search PocketMine plugins, tags, or features':
            'Cerca plugin PocketMine, tag o funzionalità',
        'No plugins available right now. Please check back soon.':
            'Nessun plugin disponibile al momento. Riprova presto.',
        'PocketMine community focus':
            'Focus sulla community PocketMine',
        'PocketMine plugins made for Minecraft Bedrock servers.':
            'Plugin PocketMine pensati per server Minecraft Bedrock.',
        'PMarketplace helps server owners compare free and premium PocketMine plugins, choose faster, and run more stable Bedrock communities.':
            'PMarketplace aiuta i proprietari di server a confrontare plugin PocketMine gratuiti e premium, scegliere più in fretta e gestire community Bedrock più stabili.',
        'Free PocketMine plugins':
            'Plugin PocketMine gratuiti',
        'Start with free plugins to launch your PocketMine-MP stack, test gameplay ideas, and improve your Minecraft Bedrock server baseline.':
            'Inizia con plugin gratuiti per avviare il tuo stack PocketMine-MP, testare idee gameplay e migliorare la base del tuo server Minecraft Bedrock.',
        'Premium PocketMine plugins':
            'Plugin PocketMine premium',
        'Scale with paid PocketMine plugins when you need deeper features, long-term support, and production-ready reliability.':
            'Passa a plugin PocketMine a pagamento quando ti servono funzionalità avanzate, supporto a lungo termine e affidabilità pronta per la produzione.',
        'Upgrade your PocketMine server with the right plugins.':
            'Potenzia il tuo server PocketMine con i plugin giusti.',
        'Compare free and premium PocketMine plugins, check pricing instantly, and deploy to your Minecraft Bedrock server faster.':
            'Confronta plugin PocketMine gratuiti e premium, verifica i prezzi subito e distribuisci più velocemente sul tuo server Minecraft Bedrock.',
        'Why PocketMine admins choose PMarketplace':
            'Perché gli admin PocketMine scelgono PMarketplace',
        'Built for real PocketMine-MP server operations.':
            'Costruito per operazioni reali su server PocketMine-MP.',
        'Everything is designed to help Minecraft Bedrock server owners compare free and premium plugins quickly and deploy with confidence.':
            'Tutto è progettato per aiutare i proprietari di server Minecraft Bedrock a confrontare plugin gratuiti e premium rapidamente e distribuire con fiducia.',
        'PMarketplace is a focused marketplace for the PocketMine community. Discover secure, high-performance PocketMine-MP plugins for Minecraft Bedrock server networks of any size.':
            'PMarketplace è un marketplace focalizzato sulla community PocketMine. Scopri plugin PocketMine-MP sicuri e ad alte prestazioni per reti di server Minecraft Bedrock di qualsiasi dimensione.',
        'Handpicked PocketMine-MP releases for Minecraft Bedrock server stability, security, and growth.':
            'Release PocketMine-MP selezionate per stabilità, sicurezza e crescita del tuo server Minecraft Bedrock.',
        'Security first':
            'Sicurezza prima di tutto',
        'PocketMine plugins built with permission-safe defaults for Bedrock server admins.':
            'Plugin PocketMine con permessi sicuri di default per admin Bedrock.',
        'Rock-solid reliability':
            'Affidabilità solida',
        'Stable plugin releases you can trust in production Minecraft Bedrock communities.':
            'Release stabili su cui contare in community Minecraft Bedrock in produzione.',
        'Maintainable core':
            'Core mantenibile',
        'Clean plugin architecture and readable configs for long-term PocketMine maintenance.':
            'Architettura pulita e configurazioni leggibili per una manutenzione PocketMine a lungo termine.',
        'Performance tuned':
            'Prestazioni ottimizzate',
        'Optimized logic that helps keep tick times low on active Bedrock servers.':
            'Logica ottimizzata che aiuta a mantenere tick time bassi su server Bedrock attivi.',
        'A PocketMine-MP plugin built for secure, reliable Minecraft Bedrock gameplay.':
            'Un plugin PocketMine-MP progettato per un gameplay Minecraft Bedrock sicuro e affidabile.',
        'Account | PMarketplace':
            'Account | PMarketplace',
        'Best for':
            'Ideale per',
        'Browse free and premium PocketMine plugins for Minecraft Bedrock servers. Filter by tag, PocketMine version, and budget to find the right plugin fast.':
            'Scopri plugin PocketMine gratuiti e premium per server Minecraft Bedrock. Filtra per tag, versione PocketMine e budget per trovare rapidamente quello giusto.',
        'Instant access after checkout, with clear documentation and updates.':
            'Accesso istantaneo dopo il checkout, con documentazione chiara e aggiornamenti.',
        'Manage your PocketMine plugin licenses and downloads.':
            'Gestisci licenze e download dei tuoi plugin PocketMine.',
        'Performance tuned logic':
            'Logica ottimizzata per le prestazioni',
        'Please sign in to view your cart.':
            'Accedi per vedere il tuo carrello.',
        'Plugins owned':
            'Plugin acquistati',
        'PocketMine plugin for Minecraft Bedrock servers':
            'Plugin PocketMine per server Minecraft Bedrock',
        'Quick review, then checkout in seconds.':
            'Controllo rapido, poi checkout in pochi secondi.',
        'Readable configs':
            'Configurazioni leggibili',
        'Response time':
            'Tempo di risposta',
        'Secure permission model':
            'Modello permessi sicuro',
        'Security, reliability, maintenance.':
            'Sicurezza, affidabilità, manutenzione.',
        'Sign in to view your licenses.':
            'Accedi per vedere le tue licenze.',
        'Sign in to view your orders.':
            'Accedi per vedere i tuoi ordini.',
        'Sign in to view your plugins.':
            'Accedi per vedere i tuoi plugin.',
        'Solid architecture, clean configs, and reliable updates for your PocketMine-MP Minecraft Bedrock server.':
            'Architettura solida, configurazioni pulite e aggiornamenti affidabili per il tuo server PocketMine-MP Minecraft Bedrock.',
        'Usually within 24 hours.':
            'Di solito entro 24 ore.',
        'You do not own any plugins yet.':
            'Non possiedi ancora alcun plugin.',
        'Your profile':
            'Il tuo profilo'
    },
    nl: {
        'Home': 'Home',
        'Contact': 'Contact',
        'About': 'Over ons',
        'Account': 'Account',
        'My account': 'Mijn account',
        'Sign in': 'Inloggen',
        'Create account': 'Account maken',
        'Username': 'Gebruikersnaam',
        'Your username': 'Jouw gebruikersnaam',
        'Password': 'Wachtwoord',
        'Submitting...': 'Versturen...',
        'Authentication failed': 'Authenticatie mislukt',
        'Network error, please try again': 'Netwerkfout, probeer opnieuw',
        'Try again': 'Probeer opnieuw',
        'Sign in | PMarketplace': 'Inloggen | PMarketplace',
        'Sign in to manage your PocketMine plugin purchases.':
            'Log in om je PocketMine plugin-aankopen te beheren.',
        'Welcome back': 'Welkom terug',
        'Sign in to access your purchases and downloads.':
            'Log in om je aankopen en downloads te bekijken.',
        'Why sign in': 'Waarom inloggen',
        'Manage licenses, download updates, and keep your PocketMine plugins organized.':
            'Beheer licenties, download updates en houd je PocketMine-plugins georganiseerd.',
        'Account preview': 'Accountvoorbeeld',
        'Cart': 'Winkelwagen',
        'Cart | PMarketplace': 'Winkelwagen | PMarketplace',
        'Your cart': 'Jouw winkelwagen',
        'Your cart is empty.': 'Je winkelwagen is leeg.',
        'Order summary': 'Besteloverzicht',
        'Total': 'Totaal',
        'Continue to checkout': 'Ga verder naar afrekenen',
        'Keep shopping': 'Verder winkelen',
        'Checkout': 'Afrekenen',
        'Checkout | PMarketplace': 'Afrekenen | PMarketplace',
        'Checkout form': 'Afrekenformulier',
        'Secure checkout': 'Veilig afrekenen',
        'Fast purchase, instant access.': 'Snelle aankoop, direct toegang.',
        'Complete purchase': 'Aankoop voltooien',
        'Checkout failed': 'Afrekenen mislukt',
        'Try again in a moment.': 'Probeer het zo opnieuw.',
        'Order created': 'Bestelling aangemaakt',
        'Full name': 'Volledige naam',
        'Your name': 'Jouw naam',
        'PocketMine server': 'PocketMine-server',
        'Server name or IP': 'Servernaam of IP',
        'Order notes': 'Bestelnotities',
        'Anything we should know?': 'Nog iets dat we moeten weten?',
        'Add a plugin to your cart to checkout.':
            'Voeg een plugin toe aan je winkelwagen om af te rekenen.',
        'Back to cart': 'Terug naar winkelwagen',
        'Please sign in to continue checkout.':
            'Log in om verder te gaan met afrekenen.',
        'Checkout preview': 'Afrekenvoorbeeld',
        'Access details are delivered instantly after payment.':
            'Toegangsgegevens worden direct na betaling geleverd.',
        'About PMarketplace | PocketMine Plugin Marketplace':
            'Over PMarketplace | PocketMine Plugin Marketplace',
        'Built for serious PocketMine servers.':
            'Gemaakt voor serieuze PocketMine-servers.',
        'Our mission': 'Onze missie',
        'What we value': 'Wat wij belangrijk vinden',
        'Contact | PMarketplace': 'Contact | PMarketplace',
        'PMarketplace support': 'PMarketplace support',
        'Contact form': 'Contactformulier',
        'Name': 'Naam',
        'Topic': 'Onderwerp',
        'General question': 'Algemene vraag',
        'Plugin catalog': 'Plugin-catalogus',
        'Custom build': 'Maatwerk',
        'Message': 'Bericht',
        'Send message': 'Verstuur bericht',
        'Download catalog': 'Download catalogus',
        'Search': 'Zoeken',
        'Tag': 'Tag',
        'Price': 'Prijs',
        'All tags': 'Alle tags',
        'All prices': 'Alle prijzen',
        'All versions': 'Alle versies',
        'Apply filters': 'Filters toepassen',
        'All PocketMine plugins': 'Alle PocketMine-plugins',
        'PocketMine Plugins (Free & Premium) | PMarketplace':
            'PocketMine-plugins (Gratis & Premium) | PMarketplace',
        'PocketMine Plugins Catalog': 'PocketMine plugin-catalogus',
        'PocketMine Plugin Not Found | PMarketplace':
            'PocketMine-plugin niet gevonden | PMarketplace',
        'Plugins': 'Plugins',
        'Add to cart': 'Toevoegen aan winkelwagen',
        'Added': 'Toegevoegd',
        'Remove': 'Verwijderen',
        'Removing...': 'Verwijderen...',
        'Failed to remove item': 'Item verwijderen mislukt',
        'Failed to add to cart': 'Toevoegen aan winkelwagen mislukt',
        'Buy now': 'Nu kopen',
        'Processing...': 'Bezig...',
        'Already purchased': 'Al gekocht',
        'Already owned': 'Al in bezit',
        'Owned': 'In bezit',
        'Purchase failed': 'Aankoop mislukt',
        'Try again shortly.': 'Probeer het zo opnieuw.',
        'Go to my account': 'Ga naar mijn account',
        'Sign in to buy': 'Log in om te kopen',
        'Plugin already owned.': 'Plugin is al in bezit.',
        'Free': 'Gratis',
        'Custom': 'Aangepast',
        'Featured': 'Uitgelicht',
        'View details': 'Bekijk details',
        'Premium PocketMine plugin.': 'Premium PocketMine-plugin.',
        'Full description': 'Volledige beschrijving',
        'Changelog': 'Wijzigingslog',
        'No changelog provided.': 'Geen changelog beschikbaar.',
        'No versions available yet.': 'Nog geen versies beschikbaar.',
        'No releases yet.': 'Nog geen releases.',
        'Latest': 'Nieuwste',
        'Past': 'Eerdere',
        'Download': 'Download',
        'Download PDF': 'Download PDF',
        'Orders': 'Bestellingen',
        'Licenses': 'Licenties',
        'No orders yet.': 'Nog geen bestellingen.',
        'No licenses yet.': 'Nog geen licenties.',
        'Issued': 'Uitgegeven',
        'License active': 'Licentie actief',
        'View plugin': 'Bekijk plugin',
        'PocketMine release': 'PocketMine-release',
        'Order confirmed': 'Bestelling bevestigd',
        'Order confirmed | PMarketplace': 'Bestelling bevestigd | PMarketplace',
        'Thanks for your purchase': 'Bedankt voor je aankoop',
        'Keep browsing': 'Verder bladeren',
        'Unable to sign out': 'Uitloggen mislukt',
        'Signing out...': 'Uitloggen...',
        'Sign out': 'Uitloggen',
        'Hide license': 'Verberg licentie',
        'See license': 'Toon licentie',
        'Ready to launch': 'Klaar om te starten',
        'Start shopping': 'Start met winkelen',
        'View cart': 'Bekijk winkelwagen',
        'Browse plugins': 'Plugins bekijken',
        'See benefits': 'Bekijk voordelen',
        'Free & Premium PocketMine Plugins for Bedrock Servers | PMarketplace':
            'Gratis & Premium PocketMine-plugins voor Bedrock-servers | PMarketplace',
        'PocketMine Plugins for Minecraft Bedrock Servers':
            'PocketMine-plugins voor Minecraft Bedrock-servers',
        'Get free and premium PocketMine plugins that just work.':
            'Krijg gratis en premium PocketMine-plugins die gewoon werken.',
        'Security Essentials Pack': 'Security Essentials-pakket',
        'Hardened permissions, safe configs, and logs.':
            'Versterkte permissies, veilige configuraties en logs.',
        'Featured PocketMine plugin': 'Uitgelichte PocketMine-plugin',
        'Top PocketMine plugins right now.':
            'Top PocketMine-plugins van dit moment.',
        'Shop free and premium PocketMine-MP plugins for Minecraft Bedrock servers. PMarketplace helps server owners find high-quality plugins for economy, factions, moderation, performance, and gameplay.':
            'Koop gratis en premium PocketMine-MP-plugins voor Minecraft Bedrock-servers. PMarketplace helpt servereigenaren hoogwaardige plugins te vinden voor economie, factions, moderatie, performance en gameplay.',
        'Shop free and premium PocketMine-MP plugins for Minecraft Bedrock servers.':
            'Koop gratis en premium PocketMine-MP-plugins voor Minecraft Bedrock-servers.',
        'Browse free and premium PocketMine plugins for Minecraft Bedrock servers.':
            'Bekijk gratis en premium PocketMine-plugins voor Minecraft Bedrock-servers.',
        'Browse free and premium PocketMine plugins for Minecraft Bedrock servers on PMarketplace.':
            'Bekijk gratis en premium PocketMine-plugins voor Minecraft Bedrock-servers op PMarketplace.',
        'Do you offer free PocketMine plugins?':
            'Bieden jullie gratis PocketMine-plugins aan?',
        'Yes. PMarketplace includes both free and premium PocketMine plugins for Minecraft Bedrock servers.':
            'Ja. PMarketplace bevat zowel gratis als premium PocketMine-plugins voor Minecraft Bedrock-servers.',
        'Are PMarketplace plugins made for PocketMine-MP servers?':
            'Zijn PMarketplace-plugins gemaakt voor PocketMine-MP-servers?',
        'Yes. PMarketplace focuses on PocketMine-MP plugins built for modern Minecraft Bedrock server communities.':
            'Ja. PMarketplace richt zich op PocketMine-MP-plugins voor moderne Minecraft Bedrock-communityservers.',
        'Learn how PMarketplace helps the PocketMine community find free and premium plugins for Minecraft Bedrock servers.':
            'Ontdek hoe PMarketplace de PocketMine-community helpt gratis en premium plugins voor Minecraft Bedrock-servers te vinden.',
        'PMarketplace helps Minecraft Bedrock server owners find secure, reliable, and maintainable PocketMine-MP plugins.':
            'PMarketplace helpt Minecraft Bedrock-servereigenaren veilige, betrouwbare en onderhoudbare PocketMine-MP-plugins te vinden.',
        'Help the PocketMine community access both free and premium plugins that keep Bedrock servers stable and communities growing.':
            'Help de PocketMine-community met toegang tot gratis en premium plugins die Bedrock-servers stabiel houden en communities laten groeien.',
        'Security, long-term reliability, and plugin quality that supports real-world PocketMine-MP operations.':
            'Beveiliging, langetermijnbetrouwbaarheid en pluginkwaliteit voor echte PocketMine-MP-operaties.',
        'Contact PMarketplace for PocketMine-MP plugin questions, free and premium plugin recommendations, and Minecraft Bedrock server support.':
            'Neem contact op met PMarketplace voor vragen over PocketMine-MP-plugins, gratis en premium aanbevelingen en ondersteuning voor Minecraft Bedrock-servers.',
        'Let’s build your next plugin.':
            'Laten we je volgende plugin bouwen.',
        'Short questions, fast answers, and a clear path to delivery for your PocketMine-MP Minecraft Bedrock server.':
            'Korte vragen, snelle antwoorden en een duidelijk leverpad voor je PocketMine-MP Minecraft Bedrock-server.',
        'We help PocketMine server owners choose the right free or premium plugins, or ship custom work quickly.':
            'We helpen PocketMine-servereigenaren de juiste gratis of premium plugins te kiezen, of snel maatwerk op te leveren.',
        'Tell us about your server and goals.':
            'Vertel ons over je server en doelen.',
        'Review your PocketMine-MP plugin selections before checkout.':
            'Controleer je PocketMine-MP-pluginselectie voor het afrekenen.',
        'Complete your PocketMine-MP plugin purchase securely.':
            'Rond je PocketMine-MP-pluginaankoop veilig af.',
        'Track orders, licenses, downloads, and changelogs.':
            'Volg bestellingen, licenties, downloads en changelogs.',
        'Download any version that belongs to your license.':
            'Download elke versie die bij je licentie hoort.',
        'Download a PDF proof for accounting or support.':
            'Download een PDF-bewijs voor administratie of support.',
        'Each license proves you own the plugin and unlocks downloads.':
            'Elke licentie bewijst eigendom van de plugin en ontgrendelt downloads.',
        'Your PocketMine plugin order has been confirmed.':
            'Je PocketMine-pluginbestelling is bevestigd.',
        'Your plugins are now available in your account, including all versions and downloads.':
            'Je plugins zijn nu beschikbaar in je account, inclusief alle versies en downloads.',
        'Discover free and paid PocketMine-MP plugins for Minecraft Bedrock servers, from economy systems to moderation and minigames.':
            'Ontdek gratis en betaalde PocketMine-MP-plugins voor Minecraft Bedrock-servers, van economie-systemen tot moderatie en minigames.',
        'Search PocketMine plugins, tags, or features':
            'Zoek PocketMine-plugins, tags of functies',
        'No plugins available right now. Please check back soon.':
            'Er zijn nu geen plugins beschikbaar. Kom snel terug.',
        'PocketMine community focus':
            'Focus op de PocketMine-community',
        'PocketMine plugins made for Minecraft Bedrock servers.':
            'PocketMine-plugins gemaakt voor Minecraft Bedrock-servers.',
        'PMarketplace helps server owners compare free and premium PocketMine plugins, choose faster, and run more stable Bedrock communities.':
            'PMarketplace helpt servereigenaren gratis en premium PocketMine-plugins te vergelijken, sneller te kiezen en stabielere Bedrock-communities te runnen.',
        'Free PocketMine plugins':
            'Gratis PocketMine-plugins',
        'Start with free plugins to launch your PocketMine-MP stack, test gameplay ideas, and improve your Minecraft Bedrock server baseline.':
            'Start met gratis plugins om je PocketMine-MP-stack te lanceren, gameplay-ideeën te testen en je Minecraft Bedrock-serverbasis te verbeteren.',
        'Premium PocketMine plugins':
            'Premium PocketMine-plugins',
        'Scale with paid PocketMine plugins when you need deeper features, long-term support, and production-ready reliability.':
            'Schaal op met betaalde PocketMine-plugins wanneer je diepere functies, langetermijnsupport en productieklare betrouwbaarheid nodig hebt.',
        'Upgrade your PocketMine server with the right plugins.':
            'Upgrade je PocketMine-server met de juiste plugins.',
        'Compare free and premium PocketMine plugins, check pricing instantly, and deploy to your Minecraft Bedrock server faster.':
            'Vergelijk gratis en premium PocketMine-plugins, bekijk prijzen direct en deploy sneller naar je Minecraft Bedrock-server.',
        'Why PocketMine admins choose PMarketplace':
            'Waarom PocketMine-admins PMarketplace kiezen',
        'Built for real PocketMine-MP server operations.':
            'Gebouwd voor echte PocketMine-MP-serveroperaties.',
        'Everything is designed to help Minecraft Bedrock server owners compare free and premium plugins quickly and deploy with confidence.':
            'Alles is ontworpen om Minecraft Bedrock-servereigenaren te helpen gratis en premium plugins snel te vergelijken en met vertrouwen te deployen.',
        'PMarketplace is a focused marketplace for the PocketMine community. Discover secure, high-performance PocketMine-MP plugins for Minecraft Bedrock server networks of any size.':
            'PMarketplace is een gerichte marketplace voor de PocketMine-community. Ontdek veilige, high-performance PocketMine-MP-plugins voor Minecraft Bedrock-servernetwerken van elke omvang.',
        'Handpicked PocketMine-MP releases for Minecraft Bedrock server stability, security, and growth.':
            'Geselecteerde PocketMine-MP-releases voor stabiliteit, beveiliging en groei van Minecraft Bedrock-servers.',
        'Security first':
            'Beveiliging eerst',
        'PocketMine plugins built with permission-safe defaults for Bedrock server admins.':
            'PocketMine-plugins met veilige standaardrechten voor Bedrock-serverbeheerders.',
        'Rock-solid reliability':
            'Stevige betrouwbaarheid',
        'Stable plugin releases you can trust in production Minecraft Bedrock communities.':
            'Stabiele pluginreleases waarop je kunt vertrouwen in productie-Minecraft Bedrock-community’s.',
        'Maintainable core':
            'Onderhoudbare kern',
        'Clean plugin architecture and readable configs for long-term PocketMine maintenance.':
            'Schone pluginarchitectuur en leesbare configuraties voor langdurig PocketMine-onderhoud.',
        'Performance tuned':
            'Prestatie-afgestemd',
        'Optimized logic that helps keep tick times low on active Bedrock servers.':
            'Geoptimaliseerde logica die ticktijden laag houdt op actieve Bedrock-servers.',
        'A PocketMine-MP plugin built for secure, reliable Minecraft Bedrock gameplay.':
            'Een PocketMine-MP-plugin gemaakt voor veilige en betrouwbare Minecraft Bedrock-gameplay.',
        'Account | PMarketplace':
            'Account | PMarketplace',
        'Best for':
            'Beste voor',
        'Browse free and premium PocketMine plugins for Minecraft Bedrock servers. Filter by tag, PocketMine version, and budget to find the right plugin fast.':
            'Bekijk gratis en premium PocketMine-plugins voor Minecraft Bedrock-servers. Filter op tag, PocketMine-versie en budget om snel de juiste plugin te vinden.',
        'Instant access after checkout, with clear documentation and updates.':
            'Directe toegang na het afrekenen, met duidelijke documentatie en updates.',
        'Manage your PocketMine plugin licenses and downloads.':
            'Beheer je PocketMine-pluginlicenties en downloads.',
        'Performance tuned logic':
            'Prestatie-geoptimaliseerde logica',
        'Please sign in to view your cart.':
            'Log in om je winkelwagen te bekijken.',
        'Plugins owned':
            'Gekochte plugins',
        'PocketMine plugin for Minecraft Bedrock servers':
            'PocketMine-plugin voor Minecraft Bedrock-servers',
        'Quick review, then checkout in seconds.':
            'Snelle controle, daarna in seconden afrekenen.',
        'Readable configs':
            'Leesbare configuraties',
        'Response time':
            'Reactietijd',
        'Secure permission model':
            'Veilig permissiemodel',
        'Security, reliability, maintenance.':
            'Beveiliging, betrouwbaarheid, onderhoud.',
        'Sign in to view your licenses.':
            'Log in om je licenties te bekijken.',
        'Sign in to view your orders.':
            'Log in om je bestellingen te bekijken.',
        'Sign in to view your plugins.':
            'Log in om je plugins te bekijken.',
        'Solid architecture, clean configs, and reliable updates for your PocketMine-MP Minecraft Bedrock server.':
            'Solide architectuur, schone configuraties en betrouwbare updates voor je PocketMine-MP Minecraft Bedrock-server.',
        'Usually within 24 hours.':
            'Meestal binnen 24 uur.',
        'You do not own any plugins yet.':
            'Je hebt nog geen plugins.',
        'Your profile':
            'Jouw profiel'
    },
    pl: {
        'Home': 'Start',
        'Contact': 'Kontakt',
        'About': 'O nas',
        'Account': 'Konto',
        'My account': 'Moje konto',
        'Sign in': 'Zaloguj sie',
        'Create account': 'Utworz konto',
        'Username': 'Nazwa uzytkownika',
        'Your username': 'Twoja nazwa uzytkownika',
        'Password': 'Haslo',
        'Submitting...': 'Wysylanie...',
        'Authentication failed': 'Logowanie nie powiodlo sie',
        'Network error, please try again': 'Blad sieci, sproboj ponownie',
        'Try again': 'Sproboj ponownie',
        'Sign in | PMarketplace': 'Logowanie | PMarketplace',
        'Sign in to manage your PocketMine plugin purchases.':
            'Zaloguj sie, aby zarzadzac zakupami pluginow PocketMine.',
        'Welcome back': 'Witaj ponownie',
        'Sign in to access your purchases and downloads.':
            'Zaloguj sie, aby zobaczyc zakupy i pobrania.',
        'Why sign in': 'Dlaczego warto sie zalogowac',
        'Manage licenses, download updates, and keep your PocketMine plugins organized.':
            'Zarzadzaj licencjami, pobieraj aktualizacje i trzymaj pluginy PocketMine w porzadku.',
        'Account preview': 'Podglad konta',
        'Cart': 'Koszyk',
        'Cart | PMarketplace': 'Koszyk | PMarketplace',
        'Your cart': 'Twoj koszyk',
        'Your cart is empty.': 'Twoj koszyk jest pusty.',
        'Order summary': 'Podsumowanie zamowienia',
        'Total': 'Razem',
        'Continue to checkout': 'Przejdz do platnosci',
        'Keep shopping': 'Kontynuuj zakupy',
        'Checkout': 'Platnosc',
        'Checkout | PMarketplace': 'Platnosc | PMarketplace',
        'Checkout form': 'Formularz platnosci',
        'Secure checkout': 'Bezpieczna platnosc',
        'Fast purchase, instant access.': 'Szybki zakup, natychmiastowy dostep.',
        'Complete purchase': 'Finalizuj zakup',
        'Checkout failed': 'Platnosc nie powiodla sie',
        'Try again in a moment.': 'Sproboj ponownie za chwile.',
        'Order created': 'Zamowienie utworzone',
        'Full name': 'Imie i nazwisko',
        'Your name': 'Twoje imie',
        'PocketMine server': 'Serwer PocketMine',
        'Server name or IP': 'Nazwa serwera lub IP',
        'Order notes': 'Notatki do zamowienia',
        'Anything we should know?': 'Cos jeszcze powinnismy wiedziec?',
        'Add a plugin to your cart to checkout.':
            'Dodaj plugin do koszyka, aby przejsc do platnosci.',
        'Back to cart': 'Powrot do koszyka',
        'Please sign in to continue checkout.':
            'Zaloguj sie, aby kontynuowac platnosc.',
        'Checkout preview': 'Podglad platnosci',
        'Access details are delivered instantly after payment.':
            'Dane dostepowe sa dostarczane od razu po platnosci.',
        'About PMarketplace | PocketMine Plugin Marketplace':
            'O PMarketplace | Marketplace pluginow PocketMine',
        'Built for serious PocketMine servers.':
            'Stworzone dla powaznych serwerow PocketMine.',
        'Our mission': 'Nasza misja',
        'What we value': 'Co cenimy',
        'Contact | PMarketplace': 'Kontakt | PMarketplace',
        'PMarketplace support': 'Wsparcie PMarketplace',
        'Contact form': 'Formularz kontaktowy',
        'Name': 'Imie',
        'Topic': 'Temat',
        'General question': 'Pytanie ogolne',
        'Plugin catalog': 'Katalog pluginow',
        'Custom build': 'Wersja na zamowienie',
        'Message': 'Wiadomosc',
        'Send message': 'Wyslij wiadomosc',
        'Download catalog': 'Pobierz katalog',
        'Search': 'Szukaj',
        'Tag': 'Tag',
        'Price': 'Cena',
        'All tags': 'Wszystkie tagi',
        'All prices': 'Wszystkie ceny',
        'All versions': 'Wszystkie wersje',
        'Apply filters': 'Zastosuj filtry',
        'All PocketMine plugins': 'Wszystkie pluginy PocketMine',
        'PocketMine Plugins (Free & Premium) | PMarketplace':
            'Pluginy PocketMine (Darmowe i Premium) | PMarketplace',
        'PocketMine Plugins Catalog': 'Katalog pluginow PocketMine',
        'PocketMine Plugin Not Found | PMarketplace':
            'Nie znaleziono pluginu PocketMine | PMarketplace',
        'Plugins': 'Pluginy',
        'Add to cart': 'Dodaj do koszyka',
        'Added': 'Dodano',
        'Remove': 'Usun',
        'Removing...': 'Usuwanie...',
        'Failed to remove item': 'Nie udalo sie usunac pozycji',
        'Failed to add to cart': 'Nie udalo sie dodac do koszyka',
        'Buy now': 'Kup teraz',
        'Processing...': 'Przetwarzanie...',
        'Already purchased': 'Juz zakupiono',
        'Already owned': 'Juz posiadasz',
        'Owned': 'Posiadane',
        'Purchase failed': 'Zakup nie powiodl sie',
        'Try again shortly.': 'Sproboj ponownie za chwile.',
        'Go to my account': 'Przejdz do mojego konta',
        'Sign in to buy': 'Zaloguj sie, aby kupic',
        'Plugin already owned.': 'Plugin jest juz posiadany.',
        'Free': 'Darmowe',
        'Custom': 'Niestandardowe',
        'Featured': 'Polecane',
        'View details': 'Zobacz szczegoly',
        'Premium PocketMine plugin.': 'Plugin PocketMine premium.',
        'Full description': 'Pelny opis',
        'Changelog': 'Lista zmian',
        'No changelog provided.': 'Brak listy zmian.',
        'No versions available yet.': 'Brak dostepnych wersji.',
        'No releases yet.': 'Brak wydan.',
        'Latest': 'Najnowsza',
        'Past': 'Starsza',
        'Download': 'Pobierz',
        'Download PDF': 'Pobierz PDF',
        'Orders': 'Zamowienia',
        'Licenses': 'Licencje',
        'No orders yet.': 'Brak zamowien.',
        'No licenses yet.': 'Brak licencji.',
        'Issued': 'Wydano',
        'License active': 'Licencja aktywna',
        'View plugin': 'Zobacz plugin',
        'PocketMine release': 'Wersja PocketMine',
        'Order confirmed': 'Zamowienie potwierdzone',
        'Order confirmed | PMarketplace': 'Zamowienie potwierdzone | PMarketplace',
        'Thanks for your purchase': 'Dziekujemy za zakup',
        'Keep browsing': 'Przegladaj dalej',
        'Unable to sign out': 'Nie mozna sie wylogowac',
        'Signing out...': 'Wylogowywanie...',
        'Sign out': 'Wyloguj sie',
        'Hide license': 'Ukryj licencje',
        'See license': 'Pokaz licencje',
        'Ready to launch': 'Gotowy do startu',
        'Start shopping': 'Rozpocznij zakupy',
        'View cart': 'Zobacz koszyk',
        'Browse plugins': 'Przegladaj pluginy',
        'See benefits': 'Zobacz korzysci',
        'Free & Premium PocketMine Plugins for Bedrock Servers | PMarketplace':
            'Darmowe i Premium pluginy PocketMine dla serwerow Bedrock | PMarketplace',
        'PocketMine Plugins for Minecraft Bedrock Servers':
            'Pluginy PocketMine dla serwerow Minecraft Bedrock',
        'Get free and premium PocketMine plugins that just work.':
            'Pobierz darmowe i premium pluginy PocketMine, ktore po prostu dzialaja.',
        'Security Essentials Pack': 'Pakiet Bezpieczenstwa Essentials',
        'Hardened permissions, safe configs, and logs.':
            'Wzmocnione uprawnienia, bezpieczne konfiguracje i logi.',
        'Featured PocketMine plugin': 'Polecany plugin PocketMine',
        'Top PocketMine plugins right now.':
            'Najlepsze pluginy PocketMine teraz.',
        'Shop free and premium PocketMine-MP plugins for Minecraft Bedrock servers. PMarketplace helps server owners find high-quality plugins for economy, factions, moderation, performance, and gameplay.':
            'Kupuj darmowe i premium pluginy PocketMine-MP dla serwerow Minecraft Bedrock. PMarketplace pomaga wlascicielom serwerow znalezc wysokiej jakosci pluginy do ekonomii, faction, moderacji, wydajnosci i gameplayu.',
        'Shop free and premium PocketMine-MP plugins for Minecraft Bedrock servers.':
            'Kupuj darmowe i premium pluginy PocketMine-MP dla serwerow Minecraft Bedrock.',
        'Browse free and premium PocketMine plugins for Minecraft Bedrock servers.':
            'Przegladaj darmowe i premium pluginy PocketMine dla serwerow Minecraft Bedrock.',
        'Browse free and premium PocketMine plugins for Minecraft Bedrock servers on PMarketplace.':
            'Przegladaj darmowe i premium pluginy PocketMine dla serwerow Minecraft Bedrock na PMarketplace.',
        'Do you offer free PocketMine plugins?':
            'Czy oferujecie darmowe pluginy PocketMine?',
        'Yes. PMarketplace includes both free and premium PocketMine plugins for Minecraft Bedrock servers.':
            'Tak. PMarketplace zawiera darmowe i premium pluginy PocketMine dla serwerow Minecraft Bedrock.',
        'Are PMarketplace plugins made for PocketMine-MP servers?':
            'Czy pluginy PMarketplace sa tworzone dla serwerow PocketMine-MP?',
        'Yes. PMarketplace focuses on PocketMine-MP plugins built for modern Minecraft Bedrock server communities.':
            'Tak. PMarketplace koncentruje sie na pluginach PocketMine-MP dla nowoczesnych spolecznosci serwerow Minecraft Bedrock.',
        'Learn how PMarketplace helps the PocketMine community find free and premium plugins for Minecraft Bedrock servers.':
            'Dowiedz sie, jak PMarketplace pomaga spolecznosci PocketMine znajdowac darmowe i premium pluginy dla serwerow Minecraft Bedrock.',
        'PMarketplace helps Minecraft Bedrock server owners find secure, reliable, and maintainable PocketMine-MP plugins.':
            'PMarketplace pomaga wlascicielom serwerow Minecraft Bedrock znalezc bezpieczne, niezawodne i latwe w utrzymaniu pluginy PocketMine-MP.',
        'Help the PocketMine community access both free and premium plugins that keep Bedrock servers stable and communities growing.':
            'Pomoc spolecznosci PocketMine w dostepie do darmowych i premium pluginow, ktore utrzymuja serwery Bedrock stabilne i wspieraja rozwoj spolecznosci.',
        'Security, long-term reliability, and plugin quality that supports real-world PocketMine-MP operations.':
            'Bezpieczenstwo, dlugoterminowa niezawodnosc i jakosc pluginow wspierajaca realne operacje PocketMine-MP.',
        'Contact PMarketplace for PocketMine-MP plugin questions, free and premium plugin recommendations, and Minecraft Bedrock server support.':
            'Skontaktuj sie z PMarketplace w sprawie pluginow PocketMine-MP, rekomendacji darmowych i premium pluginow oraz wsparcia serwerow Minecraft Bedrock.',
        'Let’s build your next plugin.':
            'Zbudujmy Twoj kolejny plugin.',
        'Short questions, fast answers, and a clear path to delivery for your PocketMine-MP Minecraft Bedrock server.':
            'Krotkie pytania, szybkie odpowiedzi i jasna sciezka realizacji dla Twojego serwera PocketMine-MP Minecraft Bedrock.',
        'We help PocketMine server owners choose the right free or premium plugins, or ship custom work quickly.':
            'Pomagamy wlascicielom serwerow PocketMine wybrac odpowiednie darmowe lub premium pluginy albo szybko dostarczyc prace na zamowienie.',
        'Tell us about your server and goals.':
            'Opowiedz nam o swoim serwerze i celach.',
        'Review your PocketMine-MP plugin selections before checkout.':
            'Sprawdz wybrane pluginy PocketMine-MP przed platnoscia.',
        'Complete your PocketMine-MP plugin purchase securely.':
            'Bezpiecznie finalizuj zakup pluginu PocketMine-MP.',
        'Track orders, licenses, downloads, and changelogs.':
            'Sledz zamowienia, licencje, pobrania i changelogi.',
        'Download any version that belongs to your license.':
            'Pobierz dowolna wersje nalezaca do Twojej licencji.',
        'Download a PDF proof for accounting or support.':
            'Pobierz potwierdzenie PDF do ksiegowosci lub wsparcia.',
        'Each license proves you own the plugin and unlocks downloads.':
            'Kazda licencja potwierdza posiadanie pluginu i odblokowuje pobrania.',
        'Your PocketMine plugin order has been confirmed.':
            'Twoje zamowienie pluginu PocketMine zostalo potwierdzone.',
        'Your plugins are now available in your account, including all versions and downloads.':
            'Twoje pluginy sa teraz dostepne na koncie, wraz ze wszystkimi wersjami i pobraniami.',
        'Discover free and paid PocketMine-MP plugins for Minecraft Bedrock servers, from economy systems to moderation and minigames.':
            'Odkrywaj darmowe i platne pluginy PocketMine-MP dla serwerow Minecraft Bedrock, od systemow ekonomii po moderacje i minigry.',
        'Search PocketMine plugins, tags, or features':
            'Szukaj pluginow PocketMine, tagow lub funkcji',
        'No plugins available right now. Please check back soon.':
            'Brak pluginow w tej chwili. Wroc wkrotce.',
        'PocketMine community focus':
            'Skupienie na spolecznosci PocketMine',
        'PocketMine plugins made for Minecraft Bedrock servers.':
            'Pluginy PocketMine stworzone dla serwerow Minecraft Bedrock.',
        'PMarketplace helps server owners compare free and premium PocketMine plugins, choose faster, and run more stable Bedrock communities.':
            'PMarketplace pomaga wlascicielom serwerow porownywac darmowe i premium pluginy PocketMine, szybciej wybierac i prowadzic stabilniejsze spolecznosci Bedrock.',
        'Free PocketMine plugins':
            'Darmowe pluginy PocketMine',
        'Start with free plugins to launch your PocketMine-MP stack, test gameplay ideas, and improve your Minecraft Bedrock server baseline.':
            'Zacznij od darmowych pluginow, aby uruchomic stack PocketMine-MP, testowac pomysly na gameplay i poprawic baze serwera Minecraft Bedrock.',
        'Premium PocketMine plugins':
            'Premium pluginy PocketMine',
        'Scale with paid PocketMine plugins when you need deeper features, long-term support, and production-ready reliability.':
            'Skaluj sie z platnymi pluginami PocketMine, gdy potrzebujesz bardziej zaawansowanych funkcji, dlugiego wsparcia i niezawodnosci produkcyjnej.',
        'Upgrade your PocketMine server with the right plugins.':
            'Rozwin swoj serwer PocketMine z odpowiednimi pluginami.',
        'Compare free and premium PocketMine plugins, check pricing instantly, and deploy to your Minecraft Bedrock server faster.':
            'Porownuj darmowe i premium pluginy PocketMine, sprawdzaj ceny od razu i wdrazaj szybciej na serwer Minecraft Bedrock.',
        'Why PocketMine admins choose PMarketplace':
            'Dlaczego administratorzy PocketMine wybieraja PMarketplace',
        'Built for real PocketMine-MP server operations.':
            'Zbudowane dla realnych operacji serwerow PocketMine-MP.',
        'Everything is designed to help Minecraft Bedrock server owners compare free and premium plugins quickly and deploy with confidence.':
            'Wszystko jest zaprojektowane, aby pomoc wlascicielom serwerow Minecraft Bedrock szybko porownywac darmowe i premium pluginy oraz wdrazac je z pewnoscia.',
        'PMarketplace is a focused marketplace for the PocketMine community. Discover secure, high-performance PocketMine-MP plugins for Minecraft Bedrock server networks of any size.':
            'PMarketplace to wyspecjalizowany marketplace dla spolecznosci PocketMine. Odkrywaj bezpieczne, wydajne pluginy PocketMine-MP dla sieci serwerow Minecraft Bedrock kazdej wielkosci.',
        'Handpicked PocketMine-MP releases for Minecraft Bedrock server stability, security, and growth.':
            'Wybrane wydania PocketMine-MP dla stabilnosci, bezpieczenstwa i rozwoju serwera Minecraft Bedrock.',
        'Security first':
            'Bezpieczenstwo przede wszystkim',
        'PocketMine plugins built with permission-safe defaults for Bedrock server admins.':
            'Pluginy PocketMine z bezpiecznymi domyslnymi uprawnieniami dla administratorow serwerow Bedrock.',
        'Rock-solid reliability':
            'Niezawodnosc na poziomie produkcyjnym',
        'Stable plugin releases you can trust in production Minecraft Bedrock communities.':
            'Stabilne wydania pluginow, ktorym mozna zaufac w produkcyjnych spolecznosciach Minecraft Bedrock.',
        'Maintainable core':
            'Latwy w utrzymaniu rdzen',
        'Clean plugin architecture and readable configs for long-term PocketMine maintenance.':
            'Czysta architektura pluginu i czytelne konfiguracje dla dlugoterminowego utrzymania PocketMine.',
        'Performance tuned':
            'Dostrojone pod wydajnosc',
        'Optimized logic that helps keep tick times low on active Bedrock servers.':
            'Zoptymalizowana logika pomagajaca utrzymac niski tick time na aktywnych serwerach Bedrock.',
        'A PocketMine-MP plugin built for secure, reliable Minecraft Bedrock gameplay.':
            'Plugin PocketMine-MP stworzony dla bezpiecznego i niezawodnego gameplayu Minecraft Bedrock.',
        'Account | PMarketplace':
            'Konto | PMarketplace',
        'Best for':
            'Najlepsze dla',
        'Browse free and premium PocketMine plugins for Minecraft Bedrock servers. Filter by tag, PocketMine version, and budget to find the right plugin fast.':
            'Przegladaj darmowe i premium pluginy PocketMine dla serwerow Minecraft Bedrock. Filtruj po tagu, wersji PocketMine i budzecie, aby szybko znalezc odpowiedni plugin.',
        'Instant access after checkout, with clear documentation and updates.':
            'Natychmiastowy dostep po platnosci, z czytelna dokumentacja i aktualizacjami.',
        'Manage your PocketMine plugin licenses and downloads.':
            'Zarzadzaj licencjami i pobraniami pluginow PocketMine.',
        'Performance tuned logic':
            'Logika zoptymalizowana pod wydajnosc',
        'Please sign in to view your cart.':
            'Zaloguj sie, aby zobaczyc swoj koszyk.',
        'Plugins owned':
            'Posiadane pluginy',
        'PocketMine plugin for Minecraft Bedrock servers':
            'Plugin PocketMine dla serwerow Minecraft Bedrock',
        'Quick review, then checkout in seconds.':
            'Szybki przeglad, potem platnosc w kilka sekund.',
        'Readable configs':
            'Czytelne konfiguracje',
        'Response time':
            'Czas odpowiedzi',
        'Secure permission model':
            'Bezpieczny model uprawnien',
        'Security, reliability, maintenance.':
            'Bezpieczenstwo, niezawodnosc, utrzymanie.',
        'Sign in to view your licenses.':
            'Zaloguj sie, aby zobaczyc swoje licencje.',
        'Sign in to view your orders.':
            'Zaloguj sie, aby zobaczyc swoje zamowienia.',
        'Sign in to view your plugins.':
            'Zaloguj sie, aby zobaczyc swoje pluginy.',
        'Solid architecture, clean configs, and reliable updates for your PocketMine-MP Minecraft Bedrock server.':
            'Solidna architektura, czyste konfiguracje i niezawodne aktualizacje dla Twojego serwera PocketMine-MP Minecraft Bedrock.',
        'Usually within 24 hours.':
            'Zwykle w ciagu 24 godzin.',
        'You do not own any plugins yet.':
            'Nie posiadasz jeszcze zadnych pluginow.',
        'Your profile':
            'Twoj profil'
    },
    ru: {
        'Home': 'Главная',
        'Contact': 'Контакты',
        'About': 'О нас',
        'Account': 'Аккаунт',
        'My account': 'Мой аккаунт',
        'Sign in': 'Войти',
        'Create account': 'Создать аккаунт',
        'Username': 'Имя пользователя',
        'Your username': 'Ваше имя пользователя',
        'Password': 'Пароль',
        'Submitting...': 'Отправка...',
        'Authentication failed': 'Ошибка авторизации',
        'Network error, please try again': 'Ошибка сети, попробуйте снова',
        'Try again': 'Попробовать снова',
        'Sign in | PMarketplace': 'Вход | PMarketplace',
        'Sign in to manage your PocketMine plugin purchases.':
            'Войдите, чтобы управлять покупками плагинов PocketMine.',
        'Welcome back': 'С возвращением',
        'Sign in to access your purchases and downloads.':
            'Войдите, чтобы получить доступ к покупкам и загрузкам.',
        'Why sign in': 'Зачем входить',
        'Manage licenses, download updates, and keep your PocketMine plugins organized.':
            'Управляйте лицензиями, загружайте обновления и держите плагины PocketMine в порядке.',
        'Account preview': 'Предпросмотр аккаунта',
        'Cart': 'Корзина',
        'Cart | PMarketplace': 'Корзина | PMarketplace',
        'Your cart': 'Ваша корзина',
        'Your cart is empty.': 'Ваша корзина пуста.',
        'Order summary': 'Сводка заказа',
        'Total': 'Итого',
        'Continue to checkout': 'Перейти к оплате',
        'Keep shopping': 'Продолжить покупки',
        'Checkout': 'Оплата',
        'Checkout | PMarketplace': 'Оплата | PMarketplace',
        'Checkout form': 'Форма оплаты',
        'Secure checkout': 'Безопасная оплата',
        'Fast purchase, instant access.': 'Быстрая покупка, мгновенный доступ.',
        'Complete purchase': 'Завершить покупку',
        'Checkout failed': 'Оплата не удалась',
        'Try again in a moment.': 'Попробуйте снова через минуту.',
        'Order created': 'Заказ создан',
        'Full name': 'Полное имя',
        'Your name': 'Ваше имя',
        'PocketMine server': 'Сервер PocketMine',
        'Server name or IP': 'Имя сервера или IP',
        'Order notes': 'Комментарий к заказу',
        'Anything we should know?': 'Есть что-то важное для нас?',
        'Add a plugin to your cart to checkout.':
            'Добавьте плагин в корзину, чтобы перейти к оплате.',
        'Back to cart': 'Назад в корзину',
        'Please sign in to continue checkout.':
            'Войдите, чтобы продолжить оплату.',
        'Checkout preview': 'Предпросмотр оплаты',
        'Access details are delivered instantly after payment.':
            'Данные доступа отправляются сразу после оплаты.',
        'About PMarketplace | PocketMine Plugin Marketplace':
            'О PMarketplace | Маркетплейс плагинов PocketMine',
        'Built for serious PocketMine servers.':
            'Создано для серьезных серверов PocketMine.',
        'Our mission': 'Наша миссия',
        'What we value': 'Что мы ценим',
        'Contact | PMarketplace': 'Контакты | PMarketplace',
        'PMarketplace support': 'Поддержка PMarketplace',
        'Contact form': 'Форма связи',
        'Name': 'Имя',
        'Topic': 'Тема',
        'General question': 'Общий вопрос',
        'Plugin catalog': 'Каталог плагинов',
        'Custom build': 'Индивидуальная разработка',
        'Message': 'Сообщение',
        'Send message': 'Отправить сообщение',
        'Download catalog': 'Скачать каталог',
        'Search': 'Поиск',
        'Tag': 'Тег',
        'Price': 'Цена',
        'All tags': 'Все теги',
        'All prices': 'Все цены',
        'All versions': 'Все версии',
        'Apply filters': 'Применить фильтры',
        'All PocketMine plugins': 'Все плагины PocketMine',
        'PocketMine Plugins (Free & Premium) | PMarketplace':
            'Плагины PocketMine (Бесплатные и Premium) | PMarketplace',
        'PocketMine Plugins Catalog': 'Каталог плагинов PocketMine',
        'PocketMine Plugin Not Found | PMarketplace':
            'Плагин PocketMine не найден | PMarketplace',
        'Plugins': 'Плагины',
        'Add to cart': 'Добавить в корзину',
        'Added': 'Добавлено',
        'Remove': 'Удалить',
        'Removing...': 'Удаление...',
        'Failed to remove item': 'Не удалось удалить позицию',
        'Failed to add to cart': 'Не удалось добавить в корзину',
        'Buy now': 'Купить сейчас',
        'Processing...': 'Обработка...',
        'Already purchased': 'Уже куплено',
        'Already owned': 'Уже куплено',
        'Owned': 'Куплено',
        'Purchase failed': 'Покупка не удалась',
        'Try again shortly.': 'Повторите попытку чуть позже.',
        'Go to my account': 'Перейти в мой аккаунт',
        'Sign in to buy': 'Войдите, чтобы купить',
        'Plugin already owned.': 'Плагин уже куплен.',
        'Free': 'Бесплатно',
        'Custom': 'Индивидуально',
        'Featured': 'Рекомендуется',
        'View details': 'Подробнее',
        'Premium PocketMine plugin.': 'Премиум плагин PocketMine.',
        'Full description': 'Полное описание',
        'Changelog': 'Список изменений',
        'No changelog provided.': 'Список изменений не указан.',
        'No versions available yet.': 'Пока нет доступных версий.',
        'No releases yet.': 'Пока нет релизов.',
        'Latest': 'Последняя',
        'Past': 'Старая',
        'Download': 'Скачать',
        'Download PDF': 'Скачать PDF',
        'Orders': 'Заказы',
        'Licenses': 'Лицензии',
        'No orders yet.': 'Пока нет заказов.',
        'No licenses yet.': 'Пока нет лицензий.',
        'Issued': 'Выдано',
        'License active': 'Лицензия активна',
        'View plugin': 'Открыть плагин',
        'PocketMine release': 'Версия PocketMine',
        'Order confirmed': 'Заказ подтвержден',
        'Order confirmed | PMarketplace': 'Заказ подтвержден | PMarketplace',
        'Thanks for your purchase': 'Спасибо за покупку',
        'Keep browsing': 'Продолжить просмотр',
        'Unable to sign out': 'Не удалось выйти',
        'Signing out...': 'Выход...',
        'Sign out': 'Выйти',
        'Hide license': 'Скрыть лицензию',
        'See license': 'Показать лицензию',
        'Ready to launch': 'Готовы запускаться',
        'Start shopping': 'Начать покупки',
        'View cart': 'Открыть корзину',
        'Browse plugins': 'Просмотреть плагины',
        'See benefits': 'Посмотреть преимущества',
        'Free & Premium PocketMine Plugins for Bedrock Servers | PMarketplace':
            'Бесплатные и премиум плагины PocketMine для Bedrock-серверов | PMarketplace',
        'PocketMine Plugins for Minecraft Bedrock Servers':
            'Плагины PocketMine для серверов Minecraft Bedrock',
        'Get free and premium PocketMine plugins that just work.':
            'Получите бесплатные и премиум плагины PocketMine, которые действительно работают.',
        'Security Essentials Pack': 'Пакет Security Essentials',
        'Hardened permissions, safe configs, and logs.':
            'Усиленные права, безопасные конфиги и логи.',
        'Featured PocketMine plugin': 'Рекомендуемый плагин PocketMine',
        'Top PocketMine plugins right now.':
            'Лучшие плагины PocketMine прямо сейчас.',
        'Shop free and premium PocketMine-MP plugins for Minecraft Bedrock servers. PMarketplace helps server owners find high-quality plugins for economy, factions, moderation, performance, and gameplay.':
            'Покупайте бесплатные и премиум плагины PocketMine-MP для серверов Minecraft Bedrock. PMarketplace помогает владельцам серверов находить качественные плагины для экономики, factions, модерации, производительности и геймплея.',
        'Shop free and premium PocketMine-MP plugins for Minecraft Bedrock servers.':
            'Покупайте бесплатные и премиум плагины PocketMine-MP для серверов Minecraft Bedrock.',
        'Browse free and premium PocketMine plugins for Minecraft Bedrock servers.':
            'Просматривайте бесплатные и премиум плагины PocketMine для серверов Minecraft Bedrock.',
        'Browse free and premium PocketMine plugins for Minecraft Bedrock servers on PMarketplace.':
            'Просматривайте бесплатные и премиум плагины PocketMine для серверов Minecraft Bedrock на PMarketplace.',
        'Do you offer free PocketMine plugins?':
            'Вы предлагаете бесплатные плагины PocketMine?',
        'Yes. PMarketplace includes both free and premium PocketMine plugins for Minecraft Bedrock servers.':
            'Да. PMarketplace включает бесплатные и премиум плагины PocketMine для серверов Minecraft Bedrock.',
        'Are PMarketplace plugins made for PocketMine-MP servers?':
            'Плагины PMarketplace сделаны для серверов PocketMine-MP?',
        'Yes. PMarketplace focuses on PocketMine-MP plugins built for modern Minecraft Bedrock server communities.':
            'Да. PMarketplace фокусируется на плагинах PocketMine-MP для современных сообществ серверов Minecraft Bedrock.',
        'Learn how PMarketplace helps the PocketMine community find free and premium plugins for Minecraft Bedrock servers.':
            'Узнайте, как PMarketplace помогает сообществу PocketMine находить бесплатные и премиум плагины для серверов Minecraft Bedrock.',
        'PMarketplace helps Minecraft Bedrock server owners find secure, reliable, and maintainable PocketMine-MP plugins.':
            'PMarketplace помогает владельцам серверов Minecraft Bedrock находить безопасные, надежные и удобные в поддержке плагины PocketMine-MP.',
        'Help the PocketMine community access both free and premium plugins that keep Bedrock servers stable and communities growing.':
            'Помогаем сообществу PocketMine получать доступ к бесплатным и премиум плагинам, которые делают Bedrock-серверы стабильнее и помогают сообществам расти.',
        'Security, long-term reliability, and plugin quality that supports real-world PocketMine-MP operations.':
            'Безопасность, долгосрочная надежность и качество плагинов для реальных задач PocketMine-MP.',
        'Contact PMarketplace for PocketMine-MP plugin questions, free and premium plugin recommendations, and Minecraft Bedrock server support.':
            'Свяжитесь с PMarketplace по вопросам плагинов PocketMine-MP, рекомендациям бесплатных и премиум плагинов и поддержке серверов Minecraft Bedrock.',
        'Let’s build your next plugin.':
            'Давайте сделаем ваш следующий плагин.',
        'Short questions, fast answers, and a clear path to delivery for your PocketMine-MP Minecraft Bedrock server.':
            'Короткие вопросы, быстрые ответы и понятный путь к релизу для вашего сервера PocketMine-MP Minecraft Bedrock.',
        'We help PocketMine server owners choose the right free or premium plugins, or ship custom work quickly.':
            'Мы помогаем владельцам серверов PocketMine выбирать подходящие бесплатные или премиум плагины и быстро выпускать кастомные решения.',
        'Tell us about your server and goals.':
            'Расскажите нам о вашем сервере и целях.',
        'Review your PocketMine-MP plugin selections before checkout.':
            'Проверьте выбранные плагины PocketMine-MP перед оплатой.',
        'Complete your PocketMine-MP plugin purchase securely.':
            'Безопасно завершите покупку плагина PocketMine-MP.',
        'Track orders, licenses, downloads, and changelogs.':
            'Отслеживайте заказы, лицензии, загрузки и changelog.',
        'Download any version that belongs to your license.':
            'Скачивайте любую версию, доступную по вашей лицензии.',
        'Download a PDF proof for accounting or support.':
            'Скачайте PDF-подтверждение для бухгалтерии или поддержки.',
        'Each license proves you own the plugin and unlocks downloads.':
            'Каждая лицензия подтверждает владение плагином и открывает загрузки.',
        'Your PocketMine plugin order has been confirmed.':
            'Ваш заказ плагина PocketMine подтвержден.',
        'Your plugins are now available in your account, including all versions and downloads.':
            'Ваши плагины уже доступны в аккаунте, включая все версии и загрузки.',
        'Discover free and paid PocketMine-MP plugins for Minecraft Bedrock servers, from economy systems to moderation and minigames.':
            'Откройте бесплатные и платные плагины PocketMine-MP для серверов Minecraft Bedrock: от экономики до модерации и мини-игр.',
        'Search PocketMine plugins, tags, or features':
            'Ищите плагины PocketMine, теги или функции',
        'No plugins available right now. Please check back soon.':
            'Сейчас плагины недоступны. Загляните позже.',
        'PocketMine community focus':
            'Фокус на сообществе PocketMine',
        'PocketMine plugins made for Minecraft Bedrock servers.':
            'Плагины PocketMine для серверов Minecraft Bedrock.',
        'PMarketplace helps server owners compare free and premium PocketMine plugins, choose faster, and run more stable Bedrock communities.':
            'PMarketplace помогает владельцам серверов сравнивать бесплатные и премиум плагины PocketMine, быстрее выбирать и развивать более стабильные сообщества Bedrock.',
        'Free PocketMine plugins':
            'Бесплатные плагины PocketMine',
        'Start with free plugins to launch your PocketMine-MP stack, test gameplay ideas, and improve your Minecraft Bedrock server baseline.':
            'Начните с бесплатных плагинов, чтобы запустить ваш стек PocketMine-MP, протестировать игровые идеи и улучшить базовую конфигурацию сервера Minecraft Bedrock.',
        'Premium PocketMine plugins':
            'Премиум плагины PocketMine',
        'Scale with paid PocketMine plugins when you need deeper features, long-term support, and production-ready reliability.':
            'Переходите на платные плагины PocketMine, когда нужны расширенные функции, долгосрочная поддержка и надежность для продакшна.',
        'Upgrade your PocketMine server with the right plugins.':
            'Улучшите ваш сервер PocketMine с правильными плагинами.',
        'Compare free and premium PocketMine plugins, check pricing instantly, and deploy to your Minecraft Bedrock server faster.':
            'Сравнивайте бесплатные и премиум плагины PocketMine, мгновенно проверяйте цены и быстрее внедряйте на ваш сервер Minecraft Bedrock.',
        'Why PocketMine admins choose PMarketplace':
            'Почему админы PocketMine выбирают PMarketplace',
        'Built for real PocketMine-MP server operations.':
            'Создано для реальной эксплуатации серверов PocketMine-MP.',
        'Everything is designed to help Minecraft Bedrock server owners compare free and premium plugins quickly and deploy with confidence.':
            'Все создано, чтобы помочь владельцам серверов Minecraft Bedrock быстро сравнивать бесплатные и премиум плагины и внедрять их с уверенностью.',
        'PMarketplace is a focused marketplace for the PocketMine community. Discover secure, high-performance PocketMine-MP plugins for Minecraft Bedrock server networks of any size.':
            'PMarketplace — специализированный маркетплейс для сообщества PocketMine. Откройте безопасные и производительные плагины PocketMine-MP для сетей серверов Minecraft Bedrock любого масштаба.',
        'Handpicked PocketMine-MP releases for Minecraft Bedrock server stability, security, and growth.':
            'Подобранные релизы PocketMine-MP для стабильности, безопасности и роста серверов Minecraft Bedrock.',
        'Security first':
            'Безопасность прежде всего',
        'PocketMine plugins built with permission-safe defaults for Bedrock server admins.':
            'Плагины PocketMine с безопасными настройками прав по умолчанию для админов Bedrock-серверов.',
        'Rock-solid reliability':
            'Высокая надежность',
        'Stable plugin releases you can trust in production Minecraft Bedrock communities.':
            'Стабильные релизы плагинов, которым можно доверять в продакшн-сообществах Minecraft Bedrock.',
        'Maintainable core':
            'Удобная поддержка',
        'Clean plugin architecture and readable configs for long-term PocketMine maintenance.':
            'Чистая архитектура плагинов и понятные конфиги для долгосрочной поддержки PocketMine.',
        'Performance tuned':
            'Оптимизация производительности',
        'Optimized logic that helps keep tick times low on active Bedrock servers.':
            'Оптимизированная логика, помогающая держать низкий tick time на активных Bedrock-серверах.',
        'A PocketMine-MP plugin built for secure, reliable Minecraft Bedrock gameplay.':
            'Плагин PocketMine-MP для безопасного и надежного геймплея Minecraft Bedrock.',
        'Account | PMarketplace':
            'Аккаунт | PMarketplace',
        'Best for':
            'Лучше всего для',
        'Browse free and premium PocketMine plugins for Minecraft Bedrock servers. Filter by tag, PocketMine version, and budget to find the right plugin fast.':
            'Просматривайте бесплатные и премиум плагины PocketMine для серверов Minecraft Bedrock. Фильтруйте по тегу, версии PocketMine и бюджету, чтобы быстро найти нужный плагин.',
        'Instant access after checkout, with clear documentation and updates.':
            'Мгновенный доступ после оплаты, с понятной документацией и обновлениями.',
        'Manage your PocketMine plugin licenses and downloads.':
            'Управляйте лицензиями и загрузками ваших плагинов PocketMine.',
        'Performance tuned logic':
            'Логика, оптимизированная под производительность',
        'Please sign in to view your cart.':
            'Войдите, чтобы посмотреть корзину.',
        'Plugins owned':
            'Купленные плагины',
        'PocketMine plugin for Minecraft Bedrock servers':
            'Плагин PocketMine для серверов Minecraft Bedrock',
        'Quick review, then checkout in seconds.':
            'Быстрый обзор, затем оплата за секунды.',
        'Readable configs':
            'Понятные конфиги',
        'Response time':
            'Время ответа',
        'Secure permission model':
            'Безопасная модель прав доступа',
        'Security, reliability, maintenance.':
            'Безопасность, надежность, поддержка.',
        'Sign in to view your licenses.':
            'Войдите, чтобы посмотреть лицензии.',
        'Sign in to view your orders.':
            'Войдите, чтобы посмотреть заказы.',
        'Sign in to view your plugins.':
            'Войдите, чтобы посмотреть ваши плагины.',
        'Solid architecture, clean configs, and reliable updates for your PocketMine-MP Minecraft Bedrock server.':
            'Надежная архитектура, чистые конфиги и стабильные обновления для вашего сервера PocketMine-MP Minecraft Bedrock.',
        'Usually within 24 hours.':
            'Обычно в течение 24 часов.',
        'You do not own any plugins yet.':
            'У вас пока нет купленных плагинов.',
        'Your profile':
            'Ваш профиль'
    }
}

function getExplicitLocaleValue<T>(locale: Locale, map: LocaleTextMap<T>): T | undefined {
    switch (locale) {
        case 'en':
            return map.en
        case 'fr':
            return map.fr
        case 'es':
            return map.es
        case 'pt-br':
            return map['pt-br']
        case 'de':
            return map.de
        case 'it':
            return map.it
        case 'nl':
            return map.nl
        case 'pl':
            return map.pl
        case 'ru':
            return map.ru
        default:
            return map.en
    }
}

function translateString(locale: AutoLocale, value: string): string {
    const exact = EXACT_TRANSLATIONS[locale][value]
    if (exact !== undefined) {
        return exact
    }

    const pluginTitleMatch = value.match(/^(.*) PocketMine Plugin \| PMarketplace$/)
    if (pluginTitleMatch) {
        const pluginName = pluginTitleMatch[1]
        if (locale === 'it') {
            return `${pluginName} Plugin PocketMine | PMarketplace`
        }
        if (locale === 'nl') {
            return `${pluginName} PocketMine-plugin | PMarketplace`
        }
        if (locale === 'pl') {
            return `${pluginName} Plugin PocketMine | PMarketplace`
        }
        if (locale === 'ru') {
            return `${pluginName} Плагин PocketMine | PMarketplace`
        }
    }

    const compatibilityMatch = value.match(
        /^(.*) Compatible with Minecraft Bedrock servers running PocketMine-MP\\.$/
    )
    if (compatibilityMatch) {
        const prefix = compatibilityMatch[1]
        if (locale === 'it') {
            return `${prefix} Compatibile con server Minecraft Bedrock che usano PocketMine-MP.`
        }
        if (locale === 'nl') {
            return `${prefix} Compatibel met Minecraft Bedrock-servers die PocketMine-MP draaien.`
        }
        if (locale === 'pl') {
            return `${prefix} Kompatybilny z serwerami Minecraft Bedrock dzialajacymi na PocketMine-MP.`
        }
        if (locale === 'ru') {
            return `${prefix} Совместим с серверами Minecraft Bedrock на PocketMine-MP.`
        }
    }

    const orderMatch = value.match(/^Order #(.*)$/)
    if (orderMatch) {
        const orderId = orderMatch[1]
        if (locale === 'it') {
            return `Ordine #${orderId}`
        }
        if (locale === 'nl') {
            return `Bestelling #${orderId}`
        }
        if (locale === 'pl') {
            return `Zamowienie #${orderId}`
        }
        if (locale === 'ru') {
            return `Заказ #${orderId}`
        }
    }

    const releasesMatch = value.match(/^Releases \\((.*)\\)$/)
    if (releasesMatch) {
        const count = releasesMatch[1]
        if (locale === 'it') {
            return `Versioni (${count})`
        }
        if (locale === 'nl') {
            return `Releases (${count})`
        }
        if (locale === 'pl') {
            return `Wydania (${count})`
        }
        if (locale === 'ru') {
            return `Релизы (${count})`
        }
    }

    return value
}

function translateValue(locale: AutoLocale, value: unknown, key?: string): unknown {
    if (key && NON_TRANSLATABLE_KEYS.has(key)) {
        return value
    }

    if (typeof value === 'string') {
        return translateString(locale, value)
    }

    if (Array.isArray(value)) {
        return value.map((item) => translateValue(locale, item))
    }

    if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>
        return Object.fromEntries(
            Object.entries(record).map(([entryKey, entryValue]) => [
                entryKey,
                translateValue(locale, entryValue, entryKey)
            ])
        )
    }

    return value
}

export function pickLocaleText<T>(locale: Locale, map: LocaleTextMap<T>): T {
    const explicit = getExplicitLocaleValue(locale, map)
    if (explicit !== undefined) {
        return explicit
    }

    if (locale === 'it' || locale === 'nl' || locale === 'pl' || locale === 'ru') {
        return translateValue(locale, map.en) as T
    }

    return map.en
}

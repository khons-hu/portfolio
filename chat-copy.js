/* AI-only notices. The local guide retains its own translations. */
const CHAT_COPY = {
  "en": [
    "Ask about Patrick, or get a project pick.",
    "AI replies use Groq. Your question and recent chat are sent there. Avoid private details. AI can be wrong.",
    "AI · GROQ",
    "Thinking…",
    "AI is unavailable. Here is a prepared answer instead."
  ],
  "sk": [
    "Opýtaj sa na Patricka alebo si nechaj odporučiť projekt.",
    "AI odpovedá cez Groq. Posiela sa tam otázka a nedávna konverzácia. Nezadávaj súkromné údaje. AI sa môže mýliť.",
    "AI · GROQ",
    "Premýšľam…",
    "AI je nedostupná. Toto je pripravená odpoveď."
  ],
  "hu": [
    "Kérdezz Patrickról, vagy kérj projektajánlót.",
    "Az AI a Groq szolgáltatást használja. A kérdésed és a legutóbbi üzenetek oda kerülnek. Ne adj meg személyes adatokat. Az AI tévedhet.",
    "AI · GROQ",
    "Gondolkodom…",
    "Az AI nem elérhető. Helyette egy előre megírt válasz következik."
  ],
  "pl": [
    "Zapytaj o Patricka albo poproś o polecenie projektu.",
    "AI korzysta z Groq. Twoje pytanie i ostatnie wiadomości są tam wysyłane. Nie podawaj prywatnych danych. AI może się mylić.",
    "AI · GROQ",
    "Myślę…",
    "AI jest niedostępna. Oto przygotowana wcześniej odpowiedź."
  ],
  "cs": [
    "Zeptej se na Patricka nebo si nech doporučit projekt.",
    "AI odpovídá přes Groq. Odesílá se tam otázka a nedávná konverzace. Nezadávej soukromé údaje. AI se může mýlit.",
    "AI · GROQ",
    "Přemýšlím…",
    "AI je nedostupná. Toto je připravená odpověď."
  ],
  "de": [
    "Frag nach Patrick oder lass dir ein Projekt empfehlen.",
    "Die KI nutzt Groq. Deine Frage und die letzten Nachrichten werden dorthin gesendet. Keine privaten Daten eingeben. Die KI kann sich irren.",
    "KI · GROQ",
    "Denke nach…",
    "Die KI ist nicht verfügbar. Hier ist stattdessen eine vorbereitete Antwort."
  ],
  "es": [
    "Pregunta por Patrick o pide una recomendación de proyecto.",
    "La IA usa Groq. Tu pregunta y los mensajes recientes se envían allí. Evita datos privados. La IA puede equivocarse.",
    "IA · GROQ",
    "Pensando…",
    "La IA no está disponible. Esta es una respuesta preparada."
  ],
  "pt": [
    "Pergunta sobre o Patrick ou pede uma recomendação de projeto.",
    "A IA usa o Groq. A tua pergunta e as mensagens recentes são enviadas para lá. Evita dados privados. A IA pode errar.",
    "IA · GROQ",
    "A pensar…",
    "A IA não está disponível. Esta é uma resposta preparada."
  ],
  "fr": [
    "Pose une question sur Patrick ou demande un projet à découvrir.",
    "L’IA utilise Groq. Ta question et les messages récents y sont envoyés. Évite les données privées. L’IA peut se tromper.",
    "IA · GROQ",
    "Réflexion…",
    "L’IA est indisponible. Voici une réponse préparée."
  ],
  "zh": [
    "了解 Patrick，或让助手推荐一个项目。",
    "AI 通过 Groq 回答。你的问题和最近的聊天内容会发送到该服务。请勿提供隐私信息。AI 可能出错。",
    "AI · GROQ",
    "思考中…",
    "AI 暂时不可用。以下是预先编写的回答。"
  ],
  "hi": [
    "Patrick के बारे में पूछें या कोई प्रोजेक्ट सुझाने को कहें।",
    "AI के जवाब Groq से आते हैं। आपका सवाल और हाल के संदेश वहाँ भेजे जाते हैं। निजी जानकारी न दें। AI गलत हो सकता है।",
    "AI · GROQ",
    "सोच रहा हूँ…",
    "AI उपलब्ध नहीं है। यह पहले से तैयार जवाब है।"
  ],
  "ar": [
    "اسأل عن Patrick أو اطلب اقتراح مشروع.",
    "يستخدم الذكاء الاصطناعي Groq. يُرسل سؤالك والرسائل الأخيرة إليه. تجنّب المعلومات الخاصة. قد يخطئ الذكاء الاصطناعي.",
    "AI · GROQ",
    "جارٍ التفكير…",
    "الذكاء الاصطناعي غير متاح. إليك إجابة معدّة مسبقًا."
  ],
  "bn": [
    "Patrick সম্পর্কে জিজ্ঞাসা করুন বা একটি প্রকল্পের পরামর্শ নিন।",
    "AI উত্তর দিতে Groq ব্যবহার করে। আপনার প্রশ্ন এবং সাম্প্রতিক বার্তা সেখানে পাঠানো হয়। ব্যক্তিগত তথ্য দেবেন না। AI ভুল করতে পারে।",
    "AI · GROQ",
    "ভাবছি…",
    "AI উপলব্ধ নেই। এটি আগে থেকে তৈরি করা উত্তর।"
  ],
  "ru": [
    "Спроси о Patrick или попроси порекомендовать проект.",
    "ИИ использует Groq. Твой вопрос и последние сообщения отправляются туда. Не вводи личные данные. ИИ может ошибаться.",
    "ИИ · GROQ",
    "Думаю…",
    "ИИ недоступен. Вот заранее подготовленный ответ."
  ],
  "ur": [
    "Patrick کے بارے میں پوچھیں یا کسی منصوبے کی تجویز مانگیں۔",
    "AI جوابات کے لیے Groq استعمال کرتا ہے۔ آپ کا سوال اور حالیہ پیغامات وہاں بھیجے جاتے ہیں۔ نجی معلومات نہ دیں۔ AI غلطی کر سکتا ہے۔",
    "AI · GROQ",
    "سوچ رہا ہوں…",
    "AI دستیاب نہیں ہے۔ یہ پہلے سے تیار کردہ جواب ہے۔"
  ],
  "id": [
    "Tanya tentang Patrick atau minta rekomendasi proyek.",
    "AI menggunakan Groq. Pertanyaan dan pesan terakhirmu dikirim ke sana. Hindari data pribadi. AI bisa salah.",
    "AI · GROQ",
    "Sedang berpikir…",
    "AI tidak tersedia. Ini jawaban yang telah disiapkan."
  ],
  "ja": [
    "Patrickについて聞くか、プロジェクトのおすすめを聞いてください。",
    "AI は Groq を利用します。質問と直近の会話が送信されます。個人情報は入力しないでください。AI は間違えることがあります。",
    "AI · GROQ",
    "考え中…",
    "AI を利用できません。代わりに用意された回答を表示します。"
  ]
};
Object.defineProperty(CHAT_COPY,'recommendations',{value:{
  en:{intro:'Here are a few projects that may fit.',heading:'A few projects that may fit',previous:'Previous project',next:'Next project',notes:'Read project notes',position:'{current} of {total}',whyTitle:'Why these?',whyText:'The picks use your question and the public titles, descriptions and project types shown here.',compareLabel:'Compare ({count}/3)',compareAria:'Compare selected projects, {count} selected',addToCompare:'Add to compare',removeFromCompare:'Remove from compare',compareTitle:'Compare projects',selectedCount:'{count} selected'},
  sk:{intro:'Tu je pár projektov, ktoré by ti mohli sadnúť.',heading:'Projekty, ktoré by ti mohli sadnúť',previous:'Predchádzajúci projekt',next:'Ďalší projekt',notes:'Pozrieť poznámky',position:'{current} z {total}',whyTitle:'Prečo tieto?',whyText:'Výber vychádza z tvojej otázky a verejných názvov, opisov a typov projektov zobrazených tu.',compareLabel:'Porovnať ({count}/3)',compareAria:'Porovnať vybrané projekty, vybrané: {count}',addToCompare:'Pridať na porovnanie',removeFromCompare:'Odobrať z porovnania',compareTitle:'Porovnanie projektov',selectedCount:'Vybrané: {count}'},
  hu:{intro:'Néhány projekt, amely érdekes lehet számodra.',heading:'Néhány neked való projekt',previous:'Előző projekt',next:'Következő projekt',notes:'Projektjegyzetek',position:'{current}/{total}',whyTitle:'Miért ezek?',whyText:'A választás a kérdésedre és az itt látható nyilvános címekre, leírásokra és projekttípusokra épül.',compareLabel:'Összehasonlítás ({count}/3)',compareAria:'Kiválasztott projektek összehasonlítása, kiválasztva: {count}',addToCompare:'Hozzáadás az összehasonlításhoz',removeFromCompare:'Eltávolítás az összehasonlításból',compareTitle:'Projektek összehasonlítása',selectedCount:'Kiválasztva: {count}'},
  pl:{intro:'Oto kilka projektów, które mogą Cię zainteresować.',heading:'Projekty, które mogą Cię zainteresować',previous:'Poprzedni projekt',next:'Następny projekt',notes:'Zobacz notatki',position:'{current} z {total}',whyTitle:'Dlaczego te?',whyText:'Wybór opiera się na Twoim pytaniu oraz widocznych tutaj publicznych nazwach, opisach i typach projektów.',compareLabel:'Porównaj ({count}/3)',compareAria:'Porównaj wybrane projekty, wybrano: {count}',addToCompare:'Dodaj do porównania',removeFromCompare:'Usuń z porównania',compareTitle:'Porównanie projektów',selectedCount:'Wybrano: {count}'},
  cs:{intro:'Tady je pár projektů, které by tě mohly zaujmout.',heading:'Projekty, které by tě mohly zaujmout',previous:'Předchozí projekt',next:'Další projekt',notes:'Zobrazit poznámky',position:'{current} z {total}',whyTitle:'Proč právě tyto?',whyText:'Výběr vychází z tvé otázky a veřejných názvů, popisů a typů projektů zobrazených zde.',compareLabel:'Porovnat ({count}/3)',compareAria:'Porovnat vybrané projekty, vybráno: {count}',addToCompare:'Přidat k porovnání',removeFromCompare:'Odebrat z porovnání',compareTitle:'Porovnání projektů',selectedCount:'Vybráno: {count}'},
  de:{intro:'Hier sind ein paar Projekte, die zu dir passen könnten.',heading:'Projekte, die zu dir passen könnten',previous:'Vorheriges Projekt',next:'Nächstes Projekt',notes:'Projektnotizen ansehen',position:'{current} von {total}',whyTitle:'Warum diese?',whyText:'Die Auswahl basiert auf deiner Frage sowie den hier sichtbaren öffentlichen Projekttiteln, Beschreibungen und Typen.',compareLabel:'Vergleichen ({count}/3)',compareAria:'Ausgewählte Projekte vergleichen, ausgewählt: {count}',addToCompare:'Zum Vergleich hinzufügen',removeFromCompare:'Aus dem Vergleich entfernen',compareTitle:'Projekte vergleichen',selectedCount:'Ausgewählt: {count}'},
  es:{intro:'Aquí tienes algunos proyectos que podrían interesarte.',heading:'Proyectos que podrían interesarte',previous:'Proyecto anterior',next:'Proyecto siguiente',notes:'Ver notas del proyecto',position:'{current} de {total}',whyTitle:'¿Por qué estos?',whyText:'La selección usa tu pregunta y los nombres, descripciones y tipos de proyecto públicos que aparecen aquí.',compareLabel:'Comparar ({count}/3)',compareAria:'Comparar proyectos seleccionados, seleccionados: {count}',addToCompare:'Añadir a la comparación',removeFromCompare:'Quitar de la comparación',compareTitle:'Comparar proyectos',selectedCount:'Seleccionados: {count}'},
  pt:{intro:'Aqui estão alguns projetos que podem interessar-te.',heading:'Projetos que podem interessar-te',previous:'Projeto anterior',next:'Projeto seguinte',notes:'Ver notas do projeto',position:'{current} de {total}',whyTitle:'Porquê estes?',whyText:'A seleção usa a tua pergunta e os nomes, descrições e tipos públicos dos projetos apresentados aqui.',compareLabel:'Comparar ({count}/3)',compareAria:'Comparar projetos selecionados, selecionados: {count}',addToCompare:'Adicionar à comparação',removeFromCompare:'Remover da comparação',compareTitle:'Comparar projetos',selectedCount:'Selecionados: {count}'},
  fr:{intro:'Voici quelques projets qui pourraient t’intéresser.',heading:'Des projets qui pourraient t’intéresser',previous:'Projet précédent',next:'Projet suivant',notes:'Lire les notes du projet',position:'{current} sur {total}',whyTitle:'Pourquoi ceux-ci ?',whyText:'La sélection tient compte de ta question et des noms, descriptions et types de projets publics affichés ici.',compareLabel:'Comparer ({count}/3)',compareAria:'Comparer les projets sélectionnés, sélectionnés : {count}',addToCompare:'Ajouter à la comparaison',removeFromCompare:'Retirer de la comparaison',compareTitle:'Comparer les projets',selectedCount:'Sélectionnés : {count}'},
  zh:{intro:'这里有几个可能适合你的项目。',heading:'你可能感兴趣的项目',previous:'上一个项目',next:'下一个项目',notes:'查看项目说明',position:'第 {current} 个，共 {total} 个',whyTitle:'为什么推荐这些？',whyText:'推荐依据是你的问题，以及此处显示的公开项目名称、描述和类型。',compareLabel:'比较 ({count}/3)',compareAria:'比较已选项目，已选 {count} 个',addToCompare:'加入比较',removeFromCompare:'从比较中移除',compareTitle:'项目比较',selectedCount:'已选 {count} 个'},
  hi:{intro:'ये कुछ प्रोजेक्ट आपके काम के हो सकते हैं।',heading:'आपकी रुचि के कुछ प्रोजेक्ट',previous:'पिछला प्रोजेक्ट',next:'अगला प्रोजेक्ट',notes:'प्रोजेक्ट की जानकारी देखें',position:'{total} में से {current}',whyTitle:'ये प्रोजेक्ट क्यों?',whyText:'चयन आपके सवाल और यहाँ दिखाए गए सार्वजनिक प्रोजेक्ट नाम, विवरण और प्रकार पर आधारित है।',compareLabel:'तुलना करें ({count}/3)',compareAria:'चुने गए प्रोजेक्ट की तुलना करें, चुने गए: {count}',addToCompare:'तुलना में जोड़ें',removeFromCompare:'तुलना से हटाएँ',compareTitle:'प्रोजेक्ट की तुलना',selectedCount:'चुने गए: {count}'},
  ar:{intro:'إليك بعض المشاريع التي قد تناسبك.',heading:'مشاريع قد تهمك',previous:'المشروع السابق',next:'المشروع التالي',notes:'اقرأ تفاصيل المشروع',position:'{current} من {total}',whyTitle:'لماذا هذه المشاريع؟',whyText:'يعتمد الاختيار على سؤالك وأسماء المشاريع العامة وأوصافها وأنواعها الظاهرة هنا.',compareLabel:'قارن ({count}/3)',compareAria:'قارن المشاريع المحددة، المحدد: {count}',addToCompare:'أضف إلى المقارنة',removeFromCompare:'أزل من المقارنة',compareTitle:'مقارنة المشاريع',selectedCount:'المحدد: {count}'},
  bn:{intro:'এখানে কয়েকটি প্রকল্প আছে যা আপনার কাজে লাগতে পারে।',heading:'আপনার আগ্রহের কিছু প্রকল্প',previous:'আগের প্রকল্প',next:'পরের প্রকল্প',notes:'প্রকল্পের নোট দেখুন',position:'{total}টির মধ্যে {current}',whyTitle:'এগুলো কেন?',whyText:'নির্বাচনটি আপনার প্রশ্ন এবং এখানে দেখা যায় এমন প্রকল্পের প্রকাশ্য নাম, বিবরণ ও ধরন ব্যবহার করে।',compareLabel:'তুলনা করুন ({count}/3)',compareAria:'নির্বাচিত প্রকল্প তুলনা করুন, নির্বাচিত: {count}',addToCompare:'তুলনায় যোগ করুন',removeFromCompare:'তুলনা থেকে সরান',compareTitle:'প্রকল্প তুলনা',selectedCount:'নির্বাচিত: {count}'},
  ru:{intro:'Вот несколько проектов, которые могут тебе подойти.',heading:'Проекты, которые могут тебя заинтересовать',previous:'Предыдущий проект',next:'Следующий проект',notes:'О проекте',position:'{current} из {total}',whyTitle:'Почему эти?',whyText:'Выбор основан на твоём вопросе и открытых названиях, описаниях и типах проектов, показанных здесь.',compareLabel:'Сравнить ({count}/3)',compareAria:'Сравнить выбранные проекты, выбрано: {count}',addToCompare:'Добавить к сравнению',removeFromCompare:'Убрать из сравнения',compareTitle:'Сравнение проектов',selectedCount:'Выбрано: {count}'},
  ur:{intro:'یہ چند منصوبے آپ کی دلچسپی کے ہو سکتے ہیں۔',heading:'آپ کی دلچسپی کے چند منصوبے',previous:'پچھلا منصوبہ',next:'اگلا منصوبہ',notes:'منصوبے کی تفصیل دیکھیں',position:'{total} میں سے {current}',whyTitle:'یہی کیوں؟',whyText:'انتخاب آپ کے سوال اور یہاں دکھائے گئے عوامی منصوبوں کے نام، تفصیل اور اقسام پر مبنی ہے۔',compareLabel:'موازنہ کریں ({count}/3)',compareAria:'منتخب منصوبوں کا موازنہ کریں، منتخب: {count}',addToCompare:'موازنے میں شامل کریں',removeFromCompare:'موازنے سے ہٹائیں',compareTitle:'منصوبوں کا موازنہ',selectedCount:'منتخب: {count}'},
  id:{intro:'Berikut beberapa proyek yang mungkin cocok untukmu.',heading:'Beberapa proyek yang mungkin cocok untukmu',previous:'Proyek sebelumnya',next:'Proyek berikutnya',notes:'Lihat catatan proyek',position:'{current} dari {total}',whyTitle:'Kenapa ini?',whyText:'Pilihan ini memakai pertanyaanmu serta nama, deskripsi, dan jenis proyek publik yang terlihat di sini.',compareLabel:'Bandingkan ({count}/3)',compareAria:'Bandingkan proyek yang dipilih, dipilih: {count}',addToCompare:'Tambahkan untuk dibandingkan',removeFromCompare:'Hapus dari perbandingan',compareTitle:'Bandingkan proyek',selectedCount:'Dipilih: {count}'},
  ja:{intro:'興味に合いそうなプロジェクトをいくつか紹介します。',heading:'興味に合いそうなプロジェクト',previous:'前のプロジェクト',next:'次のプロジェクト',notes:'プロジェクトの説明を見る',position:'全 {total} 件中 {current} 件目',whyTitle:'このプロジェクトを選んだ理由',whyText:'質問と、ここに表示されている公開プロジェクトの名前、説明、種類をもとに選んでいます。',compareLabel:'比較 ({count}/3)',compareAria:'選択したプロジェクトを比較、選択数: {count}',addToCompare:'比較に追加',removeFromCompare:'比較から削除',compareTitle:'プロジェクトを比較',selectedCount:'選択中: {count}'}
}});
Object.defineProperty(CHAT_COPY,'offline',{value:{
 en:['When AI is available, your question and recent chat go to Groq. Otherwise, prepared answers are used. Avoid private details; chat clears on reload.','AI WHEN AVAILABLE · PREPARED FALLBACK'],
 sk:['Keď je AI dostupná, otázka a nedávna konverzácia sa odošlú do Groq. Inak sa použijú pripravené odpovede. Nezadávaj súkromné údaje. Chat sa po obnovení vymaže.','AI PODĽA DOSTUPNOSTI · PRIPRAVENÉ ODPOVEDE'],
 hu:['Ha elérhető az AI, a kérdésed és a legutóbbi beszélgetés a Groqhoz kerül. Egyébként előre elkészített válaszokat kapsz. Ne adj meg személyes adatokat; frissítéskor a beszélgetés törlődik.','AI, HA ELÉRHETŐ · ELŐKÉSZÍTETT VÁLASZOK'],
 pl:['Gdy AI jest dostępne, pytanie i ostatnia rozmowa trafiają do Groq. W przeciwnym razie używane są gotowe odpowiedzi. Nie podawaj prywatnych danych. Rozmowa znika po odświeżeniu.','AI, GDY DOSTĘPNE · GOTOWE ODPOWIEDZI'],
 cs:['Když je AI dostupná, otázka a nedávný chat se odešlou do Groq. Jinak se použijí připravené odpovědi. Nezadávej soukromé údaje. Chat po obnovení zmizí.','AI PODLE DOSTUPNOSTI · PŘIPRAVENÉ ODPOVĚDI'],
 de:['Wenn KI verfügbar ist, werden deine Frage und der letzte Chat an Groq gesendet. Sonst gibt es vorbereitete Antworten. Keine privaten Daten eingeben; beim Neuladen wird der Chat gelöscht.','KI WENN VERFÜGBAR · VORBEREITETE ANTWORTEN'],
 es:['Si la IA está disponible, tu pregunta y el chat reciente se envían a Groq. Si no, se usan respuestas preparadas. Evita datos privados; el chat se borra al recargar.','IA SI ESTÁ DISPONIBLE · RESPUESTAS PREPARADAS'],
 pt:['Quando a IA está disponível, a pergunta e a conversa recente são enviadas para o Groq. Caso contrário, são usadas respostas preparadas. Evita dados privados; a conversa desaparece ao recarregar.','IA QUANDO DISPONÍVEL · RESPOSTAS PREPARADAS'],
 fr:['Quand l’IA est disponible, ta question et les échanges récents sont envoyés à Groq. Sinon, des réponses préparées sont utilisées. Évite les données privées ; le chat disparaît au rechargement.','IA SI DISPONIBLE · RÉPONSES PRÉPARÉES'],
 zh:['AI 可用时，你的问题和最近的对话会发送至 Groq；否则使用预设回答。请勿提供隐私信息；刷新页面后对话会清除。','AI 可用时 · 预设回答'],
 hi:['AI उपलब्ध होने पर आपका सवाल और हाल की बातचीत Groq को भेजी जाती है। अन्यथा तैयार जवाब मिलते हैं। निजी जानकारी न दें; पेज रीफ़्रेश करने पर चैट मिट जाती है।','AI उपलब्ध होने पर · तैयार जवाब'],
 ar:['عند توفر الذكاء الاصطناعي، يُرسل سؤالك وآخر المحادثة إلى Groq. وإلا فستُستخدم إجابات مُعدة مسبقًا. تجنب المعلومات الخاصة؛ تُحذف المحادثة عند إعادة التحميل.','الذكاء الاصطناعي عند توفره · إجابات مُعدة'],
 bn:['AI পাওয়া গেলে আপনার প্রশ্ন ও সাম্প্রতিক কথোপকথন Groq-এ পাঠানো হবে। না হলে প্রস্তুত উত্তর ব্যবহার করা হবে। ব্যক্তিগত তথ্য দেবেন না; পৃষ্ঠা রিফ্রেশ হলে চ্যাট মুছে যাবে।','AI থাকলে · প্রস্তুত উত্তর'],
 ru:['Когда доступен ИИ, вопрос и недавняя переписка отправляются в Groq. Иначе используются готовые ответы. Не указывайте личные данные; после перезагрузки чат очищается.','ИИ ПРИ НАЛИЧИИ · ГОТОВЫЕ ОТВЕТЫ'],
 ur:['AI دستیاب ہو تو آپ کا سوال اور حالیہ گفتگو Groq کو بھیجی جاتی ہے۔ ورنہ تیار جوابات استعمال ہوتے ہیں۔ نجی معلومات نہ دیں؛ صفحہ دوبارہ کھلنے پر چیٹ مٹ جاتی ہے۔','AI دستیاب ہو تو · تیار جوابات'],
 id:['Saat AI tersedia, pertanyaan dan percakapan terbaru dikirim ke Groq. Jika tidak, jawaban yang sudah disiapkan akan digunakan. Hindari data pribadi; chat dihapus saat halaman dimuat ulang.','AI JIKA TERSEDIA · JAWABAN SIAP PAKAI'],
 ja:['AIが利用できる場合、質問と直近の会話がGroqに送信されます。利用できない場合は用意された回答を使います。個人情報は入力しないでください。再読み込みで会話は消去されます。','AI利用時 · 用意された回答']
}});
if(typeof module!=="undefined")module.exports=CHAT_COPY;

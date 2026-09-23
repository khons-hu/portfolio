/* Copy for the 404 page. Uses the same saved language choice as the main page, without loading its catalogs. */
(function (root) {
  const copy = {
    en: ['This page doesn’t exist.', 'The address may be old or mistyped.', 'Back to the portfolio', 'Skip to content'],
    sk: ['Táto stránka neexistuje.', 'Adresa môže byť stará alebo zle napísaná.', 'Späť na portfólio', 'Preskočiť na obsah'],
    cs: ['Tato stránka neexistuje.', 'Adresa může být stará nebo špatně napsaná.', 'Zpět na portfolio', 'Přeskočit na obsah'],
    hu: ['Ez az oldal nem létezik.', 'A cím lehet régi vagy elgépelt.', 'Vissza a portfólióhoz', 'Ugrás a tartalomra'],
    pl: ['Ta strona nie istnieje.', 'Adres może być nieaktualny lub błędnie wpisany.', 'Wróć do portfolio', 'Przejdź do treści'],
    de: ['Diese Seite gibt es nicht.', 'Die Adresse ist vielleicht veraltet oder vertippt.', 'Zurück zum Portfolio', 'Zum Inhalt springen'],
    es: ['Esta página no existe.', 'Puede que la dirección sea antigua o esté mal escrita.', 'Volver al portfolio', 'Saltar al contenido'],
    pt: ['Esta página não existe.', 'O endereço pode estar desatualizado ou mal escrito.', 'Voltar ao portfólio', 'Ir para o conteúdo'],
    fr: ['Cette page n’existe pas.', 'L’adresse est peut-être ancienne ou mal saisie.', 'Retour au portfolio', 'Aller au contenu'],
    zh: ['此页面不存在。', '地址可能已过期或输入有误。', '返回作品集', '跳转到内容'],
    ja: ['このページは存在しません。', 'アドレスが古いか、入力に誤りがある可能性があります。', 'ポートフォリオに戻る', '本文へ移動'],
    hi: ['यह पेज मौजूद नहीं है।', 'पता पुराना हो सकता है या गलत लिखा गया हो।', 'पोर्टफ़ोलियो पर वापस जाएँ', 'मुख्य सामग्री पर जाएँ'],
    bn: ['এই পৃষ্ঠাটি নেই।', 'ঠিকানাটি পুরোনো বা ভুল লেখা হতে পারে।', 'পোর্টফোলিওতে ফিরে যান', 'মূল লেখায় যান'],
    ar: ['هذه الصفحة غير موجودة.', 'قد يكون العنوان قديمًا أو مكتوبًا بشكل خاطئ.', 'العودة إلى المعرض', 'انتقل إلى المحتوى'],
    ru: ['Такой страницы нет.', 'Возможно, адрес устарел или набран с ошибкой.', 'Вернуться к портфолио', 'Перейти к содержимому'],
    ur: ['یہ صفحہ موجود نہیں ہے۔', 'پتہ پرانا یا غلط لکھا ہوا ہو سکتا ہے۔', 'پورٹ فولیو پر واپس جائیں', 'اصل مواد پر جائیں'],
    id: ['Halaman ini tidak ada.', 'Alamatnya mungkin sudah lama atau salah ketik.', 'Kembali ke portofolio', 'Lewati ke konten']
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = copy; return; }
  // theme.js already chose the language and direction before first paint.
  const text = copy[root.document.documentElement.lang] || copy.en;
  const [title, detail, back, skip] = text;
  root.document.title = title.replace(/[.。।]$/, '') + ' · khonsu';
  root.document.querySelector('#not-found-title').textContent = title;
  root.document.querySelector('#not-found-detail').textContent = detail;
  root.document.querySelector('#not-found-back').firstChild.nodeValue = back + ' ';
  root.document.querySelector('.skip').textContent = skip;
})(globalThis);

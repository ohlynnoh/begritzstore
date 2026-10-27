window.BEGRITZ_RELEASE = {"version":"1.3","updated":"2026-10-27T14:15:41.995Z"};
document.querySelectorAll("[data-site-version]").forEach(el=>el.textContent=window.BEGRITZ_RELEASE.version);
document.querySelectorAll("[data-site-year]").forEach(el=>el.textContent=new Intl.DateTimeFormat("en",{year:"numeric",timeZone:"Asia/Taipei"}).format(new Date()));

window.BEGRITZ_RELEASE = {"version":"1.8","updated":"2026-11-12T08:40:43.867Z"};
document.querySelectorAll("[data-site-version]").forEach(el=>el.textContent=window.BEGRITZ_RELEASE.version);
document.querySelectorAll("[data-site-year]").forEach(el=>el.textContent=new Intl.DateTimeFormat("en",{year:"numeric",timeZone:"Asia/Taipei"}).format(new Date()));

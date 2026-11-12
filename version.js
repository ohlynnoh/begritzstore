window.BEGRITZ_RELEASE = {"version":"1.9","updated":"2026-11-12T09:09:16.713Z"};
document.querySelectorAll("[data-site-version]").forEach(el=>el.textContent=window.BEGRITZ_RELEASE.version);
document.querySelectorAll("[data-site-year]").forEach(el=>el.textContent=new Intl.DateTimeFormat("en",{year:"numeric",timeZone:"Asia/Taipei"}).format(new Date()));

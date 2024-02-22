(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/contact.js
  window.Webflow ||= [];
  window.Webflow.push(() => {
    $(".contact_wrap .button").click(function() {
      $(".form_submit")[0].click();
    });
    $("textarea").each(function() {
      this.setAttribute("style", "height:" + this.scrollHeight + "px;overflow-y:hidden;");
    }).on("input", function() {
      this.style.height = 0;
      this.style.height = this.scrollHeight + "px";
    });
  });
})();
//# sourceMappingURL=contact.js.map

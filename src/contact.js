window.Webflow ||= [];
window.Webflow.push(() => {
  // ————— FAKE FORM SUBMIT ————— //
  $('.contact_wrap .button').click(function () {
    $('.form_submit')[0].click();
  });
  // ————— FAKE FORM SUBMIT ————— //

  // ————— EXPAND TEXT FIELD ON INPUT ————— //
  $('textarea')
    .each(function () {
      this.setAttribute('style', 'height:' + this.scrollHeight + 'px;overflow-y:hidden;');
    })
    .on('input', function () {
      this.style.height = 0;
      this.style.height = this.scrollHeight + 'px';
    });
  // ————— EXPAND TEXT FIELD ON INPUT ————— //
});

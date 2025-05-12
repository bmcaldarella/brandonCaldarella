
// Preloader
$(window).on('load', function () {
  console.log("✅ ");
  if ($('#preloader').length) {
    $('#preloader').delay(1000).fadeOut('slow', function () {
      $(this).remove();
    });
  }
});

// function AJAX
function handleApiCall(btnSelector, inputFields, url, paramNames) {
  $(btnSelector).on('click', function () {
    const data = {};
    let valid = true;

    inputFields.forEach((selector, index) => {
      const value = $(selector).val();
      if (!value) valid = false;
      data[paramNames[index]] = value;
    });

    if (!valid) {
      alert('Please fill in all fields');
      return;
    }

    $.ajax({
      url,
      method: 'GET',
      data,
      dataType: 'json',
      success: function (data) {
        if (url.includes('getWikipedia.php')) {
          let html = '<ul>';
          data.geonames.forEach(item => {
            html += `
              <li style="margin-bottom: 20px;">
                <h3>${item.title}</h3>
                ${item.thumbnailImg ? `<img src="${item.thumbnailImg}" alt="${item.title}" style="max-width:100px;">` : ''}
                <p>${item.summary}</p>
                <a href="https://${item.wikipediaUrl}" target="_blank">More info</a>
              </li>
            `;
          });
          html += '</ul>';
          $('#output').html(html);
        } else if (url.includes('getTimezone.php')) {
          const tz = data;
          const html = `
            <h3>Zona horaria</h3>
            <p><strong>Country:</strong> ${tz.countryName}</p>
            <p><strong>Timezone:</strong> ${tz.timezoneId}</p>
            <p><strong>GMT Offset:</strong> ${tz.gmtOffset}</p>
            <p><strong>Current Time:</strong> ${tz.time}</p>
          `;
          $('#output').html(html);
        } else if (url.includes('getPostalCodes.php')) {
          let html = '<h3>Códigos Postales Cercanos</h3><ul>';
          data.postalCodes.forEach(code => {
            html += `<li>${code.placeName}, ${code.postalCode} (${code.distance} km)</li>`;
          });
          html += '</ul>';
          $('#output').html(html);
        } else {
          $('#output').text(JSON.stringify(data, null, 2));
        }
      },
      error: function () {
        $('#output').text(`Error calling ${url}`);
      }
    });
  });
}

handleApiCall('#btn1', ['#lat1', '#lng1'], 'libs/php/getTimezone.php', ['lat', 'lng']);
handleApiCall('#btn2', ['#lat2', '#lng2'], 'libs/php/getPostalCodes.php', ['lat', 'lng']);
handleApiCall('#btn3', ['#query3'], 'libs/php/getWikipedia.php', ['query']);

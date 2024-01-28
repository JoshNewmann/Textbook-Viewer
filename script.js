let pagesDisplayed = 1;
let zoomLevel = 48.5;
let book = 'methods';

document.addEventListener('DOMContentLoaded', () => {
    const methodsButton = document.getElementById('methods-button');
    const specButton = document.getElementById('spec-button');
    const downloadButton = document.getElementById('download-button');
    const pageNumberInput = document.getElementById('page-number');
    const onePageButton = document.getElementById('one-page-button');
    const twoPageButton = document.getElementById('two-page-button');
    const imageDiv = document.getElementById('image');
    const image2Div = document.getElementById('image2');
    const specchapters = document.getElementById('specchapters');
    const methodschapters = document.getElementById('methodschapters');
  
    methodsButton.addEventListener('click', () => {
      methodsButton.classList.add('active-button');
      specButton.classList.remove('active-button');
      pageNumberInput.value = localStorage.getItem('Methods') || 1;
      document.documentElement.style.setProperty('--theme', '#16679a');
      document.title = '12 Maths Methods Textbook';
      specchapters.style.display = 'none';
      methodschapters.style.display = 'block';
      book = 'methods';
      handleLoadImages();
    });
  
    specButton.addEventListener('click', () => {
      specButton.classList.add('active-button');
      methodsButton.classList.remove('active-button');
      pageNumberInput.value = localStorage.getItem('Spec') || 1;
      document.documentElement.style.setProperty('--theme', '#7209b7');
      document.title = '12 Specialist Maths Textbook';
      specchapters.style.display = 'block';
      methodschapters.style.display = 'none';
      book = 'spec';
      handleLoadImages();
    });
  
    downloadButton.addEventListener('click', () => {
      handleDownload();
    });
  
    pageNumberInput.addEventListener('input', () => {
      handleLoadImages();
    });
    
    specchapters.addEventListener('change', function() {
      const selectedValue = specchapters.value;

      // If the selected value is not '1' (Go to Chapter)
      if (selectedValue !== '1') {
          // Set the value of #page-number input to the selected option's value
          pageNumberInput.value = selectedValue;
          handleLoadImages();

          // Set the selected option back to 'Go to Chapter'
          specchapters.value = '1';
      }
    });

    methodschapters.addEventListener('change', function() {
      const selectedValue = methodschapters.value;

      // If the selected value is not '1' (Go to Chapter)
      if (selectedValue !== '1') {
          // Set the value of #page-number input to the selected option's value
          pageNumberInput.value = selectedValue;
          handleLoadImages();

          // Set the selected option back to 'Go to Chapter'
          methodschapters.value = '1';
      }
    });
    
    onePageButton.addEventListener('click', () => {
      onePageButton.classList.add('active-button');
      twoPageButton.classList.remove('active-button');
      image2Div.style.display = 'none';
      pagesDisplayed = 1
      zoomInButton.disabled = false;
      handleLoadImages();
    });
  
    twoPageButton.addEventListener('click', () => {
      twoPageButton.classList.add('active-button');
      onePageButton.classList.remove('active-button');
      image2Div.style.display = 'block';
      pagesDisplayed = 2;
      zoomLevel = 48.5;
      zoomInButton.disabled = true;
      applyContainerZoom()
      
      const pageNumber = parseInt(pageNumberInput.value, 10);
      const nextPageNumber = pageNumber + 1;
  
      handleLoadImages(pageNumber, nextPageNumber);
    });
  
    function handleLoadImages(pageNumber, nextPageNumber) {
      const passwordCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('password='));
      const password = passwordCookie ? passwordCookie.split('=')[1] : null;
  
      if (!password) {
        const passwordPrompt = prompt('Please enter the password:');
        document.cookie = `password=${passwordPrompt}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
      }
  
      const bookType = methodsButton.classList.contains('active-button') ? 'Methods' : 'Spec';
      const currentPageNumber = pageNumber || pageNumberInput.value;
      const nextPage = nextPageNumber || parseInt(currentPageNumber, 10) + 1;
  
      localStorage.setItem(bookType, currentPageNumber);
  
      fetchImages('image', currentPageNumber);
      fetchImages('image2', nextPage);
  
      function fetchImages(containerId, pageNum) {
        fetch('http://localhost:2202/getpage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password,
            page: `page${pageNum}`,
            bookType,
          }),
        })
          .then((response) => {
            if (response.status === 401) {
              throw new Error('Unauthorized');
            } else if (response.status === 404) {
              throw new Error('Page not found');
            } else {
              return response.blob();
            }
          })
          .then((blob) => {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(blob);
  
            const containerDiv = document.getElementById(containerId);
            containerDiv.innerHTML = '';
            containerDiv.appendChild(img.cloneNode(true));
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    
    document.getElementById('page-down-button').addEventListener('click', function() {
      adjustPageNumber(-1);
      handleLoadImages();
    });
    
    document.getElementById('page-up-button').addEventListener('click', function() {
      adjustPageNumber(1);
      handleLoadImages();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        adjustPageNumber(-1);
        handleLoadImages();
      } else if (event.key === 'ArrowUp') {
        adjustPageNumber(1);
        handleLoadImages();
      }
    });
    
    function adjustPageNumber(change) {
      const pageNumberInput = document.getElementById('page-number');
      let currentPage = parseInt(pageNumberInput.value, 10) || 1;
      currentPage += change;
      
      currentPage = Math.min(500, Math.max(1, currentPage));
    
      pageNumberInput.value = currentPage;
    }

    function handleDownload() {
      // Add download functionality
      // You can use the existing logic for fetching data and handling the download
    }

    specchapters.style.display = 'none';
    document.title = '12 Maths Methods Textbook';
    handleLoadImages();
  });

  const zoomInButton = document.getElementById('zoom-in-button');
  const zoomOutButton = document.getElementById('zoom-out-button');
  const imageContainer = document.querySelector('.imagecontainer');
  const imageContainers = document.querySelectorAll('.imagecontainer');
  const image1 = document.getElementById('image');
  const image2 = document.getElementById('image2');
    
  zoomInButton.addEventListener('click', () => {
    if (zoomLevel >= (pagesDisplayed === 2 ? 48.5 : 93.5)) {
      return; // Reached upper zoom limit
    }
    zoomLevel += 5;
    applyZoom();
  });
  
  zoomOutButton.addEventListener('click', () => {
    if (zoomLevel <= (pagesDisplayed === 2 ? 8.5 : 48.5)) {
      return; // Reached lower zoom limit
    }
    zoomLevel -= 5;
    applyZoom();
  });
  
  
  function applyContainerZoom() {
    imageContainers.forEach(container => {
      container.style.maxWidth = `${zoomLevel}vw`;
    });
  }

  function applyZoom() {
    applyContainerZoom();
    
    // Adjust margins
    const remainingWidth = 100 - zoomLevel;
    const marginValue = remainingWidth / 2;
    image1.style.marginRight = `${marginValue}vw`;
    image2.style.marginLeft = `-${marginValue}vw`;
  
    // Disable/Enable buttons based on zoom level
    zoomInButton.disabled = zoomLevel >= (pagesDisplayed === 2 ? 48.5 : 93.5);
    zoomOutButton.disabled = zoomLevel <= (pagesDisplayed === 2 ? 8.5 : 48.5);
  }

  const fullscreenButton = document.getElementById('fullscreen-button');

// Function to update button state
function updateButtonState() {
  if (document.fullscreenElement) {
    fullscreenButton.textContent = '🗗'; // Change button icon to exit fullscreen
    fullscreenButton.classList.add('active-button'); // Add active-button class
  } else {
    fullscreenButton.textContent = '🗖'; // Change button icon to enter fullscreen
    fullscreenButton.classList.remove('active-button'); // Remove active-button class
  }
}

// Toggle fullscreen when button is clicked
fullscreenButton.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Update button state when fullscreen mode changes
document.addEventListener('fullscreenchange', updateButtonState);

// Listen for the 'Escape' key to exit fullscreen
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.fullscreenElement) {
    document.exitFullscreen();
  }
});

// Initial update of button state
updateButtonState();

//ID Cookie
document.addEventListener("DOMContentLoaded", function() {
  // Function to generate a random string
  function generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let randomString = '';
      for (let i = 0; i < length; i++) {
          randomString += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return randomString;
  }

  // Function to set or renew the cookie
  function setOrRenewCookie() {
      const cookieName = 'id';
      const cookieExpiryDays = 400;

      // Check if the cookie exists
      const existingCookie = getCookie(cookieName);
      if (existingCookie) {
          // Renew the existing cookie
          document.cookie = `${cookieName}=${existingCookie}; expires=${getCookieExpiry(cookieExpiryDays)}; path=/`;
      } else {
          // Generate a random string
          const randomString = generateRandomString(64);
          // Set the new cookie
          document.cookie = `${cookieName}=${randomString}; expires=${getCookieExpiry(cookieExpiryDays)}; path=/`;
      }
  }

  // Function to get the expiry date for the cookie
  function getCookieExpiry(days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      return date.toUTCString();
  }

  // Function to get the value of a cookie by name
  function getCookie(name) {
      const cookieArray = document.cookie.split('; ');
      for (let i = 0; i < cookieArray.length; i++) {
          const cookiePair = cookieArray[i].split('=');
          if (cookiePair[0] === name) {
              return decodeURIComponent(cookiePair[1]);
          }
      }
      return null;
  }

  // Set or renew the cookie upon page load
  setOrRenewCookie();
});

const idValue = document.cookie.split('; ').find(row => row.startsWith('id=')).split('=')[1];
// END ID COOKIE CODE

function handleImageClick(event) {
  event.preventDefault();
  
  var clickedImageId = event.target.parentElement.id;
  var pageNumber = parseInt(pageNumberInput.value);

  if (clickedImageId === 'image') {
      console.log('Clicked Image: ' + pageNumber);
  } else if (clickedImageId === 'image2') {
      console.log('Clicked Image: ' + (pageNumber + 1));
  }

  var pixelX = event.offsetX;
  var pixelY = event.offsetY;
  console.log('Clicked Pixel: (' + pixelX + ', ' + pixelY + ')');

  var comment = prompt('Enter your comment:');
  var data = {
      image: clickedImageId === 'image' ? pageNumber : pageNumber + 1,
      pixelX: pixelX,
      pixelY: pixelY,
      comment: comment,
      book: book,
      id: idValue,
      user: 'anonymous' // Always set the username to 'anonymous'
  };

  var jsonData = JSON.stringify(data);
  console.log('JSON Data: ' + jsonData);

  fetch('http://localhost:2202/addcomment', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: jsonData
  })
  .then(response => {
      if (response.ok) {
          console.log('Comment added successfully');
          // Optionally, you can perform additional actions upon successful response
      } else {
          console.error('Error adding comment:', response.statusText);
          // Handle error condition here
      }
  })
  .catch(error => {
      console.error('Error adding comment:', error);
      // Handle network error here
  });
}


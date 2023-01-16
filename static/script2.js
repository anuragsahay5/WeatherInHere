let cur_loc_btn = document.getElementById("cur_loc_btn");
let lon = document.getElementById("lon");
let lat = document.getElementById("lat");

cur_loc_btn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lon.value = pos.coords.longitude;
        lat.value = pos.coords.latitude;
        cur_loc_btn.parentNode.submit();
      },
      (err) => {
        window.alert("Please Allow Location Access");
      }
    );
  } else {
    window.alert("Please Enable Location Access");
  }
});

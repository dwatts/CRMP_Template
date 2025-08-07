/***Send images to modal and launch***/

$('.app-image').click(function (e) {
    let location = $(e.target).attr('src')
    let caption = $(e.target).attr('data-caption')
    $('#neatModalImg').attr('src', location);
    $('#img-modal').fadeIn(500);
    $('#img-caption').html(caption);
});

/***Trigger about modal***/

$('.nav-item:nth-of-type(5)').click(function (e) {
    $('#about-modal').fadeIn(500);
})

/***Close image modal***/

$('#modal-close, #img-close').click(function (e) {
    $('#img-modal').fadeOut(500);
    $('#about-modal').fadeOut(500);
})

/***Open / Close side panel***/

$('#panel-btn').click(function(){
  $('.side-panel').toggleClass('on');
  $('#panel-btn').toggleClass('on');
});

$('#panel-close').click(function(){
  $('.side-panel').addClass('on');
  $('#panel-btn').toggleClass('on');
});

/***Open / Close about panel***/

$('#help-btn').click(function(){
  $('.help-panel').toggleClass('on');
  $('#help-btn').toggleClass('on');
});

$('#help-close').click(function(){
  $('.help-panel').toggleClass('on');
  $('#help-btn').toggleClass('on');
});

/***Start ArcGIS JS***/

require(["esri/views/SceneView", "esri/WebScene", "esri/layers/FeatureLayer", "esri/layers/TileLayer"], (SceneView, WebScene, FeatureLayer, TileLayer) => {

    /***Add Layers***/

    const cities = new FeatureLayer({
      url: "https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/Test_Cities/FeatureServer",
      id: "cities",
      outFields: ["*"],
      renderer: cityRenderer
    })

    const baseMap = new TileLayer({
      url: "https://tiles.arcgis.com/tiles/njxlOVQKvDzk10uN/arcgis/rest/services/AAA_National_Highway_Map/MapServer",
      opacity: 0.7
    })

    /***Create Map and View***/

    const map = new WebScene({
        //basemap: "topo-3d",
        // ground: "world-elevation",
        layers: [baseMap, cities],
    });

    map.ground.opacity = 0;

    const view = new SceneView({
        container: "viewDiv",
        map: map,
        qualityProfile: "high",
        highlights: [
          {name: "custom", color: "#649b92", haloColor: "#649b92", haloOpacity: 0.9, fillOpacity: 0.5, shadowOpacity: 0.2}
        ],
        environment: {
          background:{
              type: "color", 
              color: [244, 245, 240, 1]
          },
          atmosphereEnabled: false,
          starsEnabled: false
        },
        constraints: {
          altitude: {
            min: 1500000,
            max: 8000000
          }
        },
        camera: {
          position: {
            // spatialReference: {
            //   latestWkid: 3857,
            //   wkid: 2857
            // },
            x: -97.3497654896104,
            y: 38.938391919294915,
            z: 7783963.6349063385
          },
          heading: 359.627264859108,
          tilt: 0.22518567955045343
        },
        ui: {
            components: []
        },
        viewingMode: "global"
    });

    /***Start HitTest Functionality***/

    let image = document.getElementById('cardImageId');
    let city = document.getElementById('popCityState');
    let date = document.getElementById('popDate');
    let notes = document.getElementById('popNotes');

    let highlight;

    view.on("immediate-click", (event) => {
      view.hitTest(event).then((hitResult) => {
        if (hitResult.results.length > 0 && hitResult.results[0].graphic.layer.id == "cities") {
            
            /***Make popup div visible***/
          
            $('#cardId').fadeIn();
            $('#cardId').css('display','flex');

            /***Access all data attributes via hitTest***/

            let attributes = hitResult.results[0].graphic.attributes;

            /***Set HTML Text in Popup***/

            image.src = attributes.URL;
            city.innerHTML = `${attributes.City}, ${attributes.State} >`;
            date.innerHTML = attributes.Date;
            notes.innerHTML = attributes.Notes;

            /***Set Popup Modal Image Caption***/
            $('#cardImageId').attr('data-caption', attributes.Caption);

            /***Highlight points functionality***/

            let result = hitResult.results[0].graphic;

            view.whenLayerView(result.layer).then((layerView) => {
                highlight?.remove();
                highlight = layerView.highlight(result, { name: "custom"});
            });

        } else {
            $('#cardId').fadeOut();
            highlight?.remove();
        }
      })
    })

    /***End HitTest Functionality***/


});
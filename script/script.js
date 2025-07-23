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

require(["esri/views/SceneView", "esri/WebScene", "esri/layers/FeatureLayer"], (SceneView, WebScene, FeatureLayer) => {

    /***Add Layers***/

    const cities = new FeatureLayer({
      url: "https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/Test_Cities/FeatureServer",
      id: "cities",
      outFields: ["*"],
      renderer: cityRenderer
    })

    /***Create Map and View***/

    const map = new WebScene({
        basemap: "topo-3d",
        ground: "world-elevation",
        layers: [cities],
    });

    // const customHighlight = {
    //   color: [252, 132, 3],
    //   fillOpacity: 0.4,
    //   haloOpacity: 0.8,
    //   haloColor: [66, 34, 140],
    //   shadowOpacity: 0.2
    // }    

    const view = new SceneView({
        container: "viewDiv",
        map: map,
        qualityProfile: "high",
        highlights: [
          {name: "custom", color: "#649b92", haloColor: "#649b92", haloOpacity: 0.9, fillOpacity: 0.5, shadowOpacity: 0.2}
        ],
        camera: {
          position: {
            spatialReference: {
              latestWkid: 3857,
              wkid: 102100
            },
            x: -10958895.27999855,
            y: 4655064.762861561,
            z: 5358344.169864016
          },
          heading: 2.122359174463156,
          tilt: 0.27174524597590394
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
    // let currentGraphic;
    // let countNumber = 0;

    

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
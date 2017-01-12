function cleaning(val){
  if(typeof val == "undefined" || typeof val === "object")
    return val;
  return (val.replace(/(\r\n|\n|\r})/gm,"").replace(/\s\s+/g," ")).trim();
}

function append(el,key,val){
  val = cleaning(val);
  if(key in el && Array.isArray(el[key])){
    el[key].push(val);
  }else if(key in el){
    el[key] = jQuery.makeArray(el[key]);
    el[key].push(val);
  }else{
    el[key] = val;
  }
  return el;
}

/*
convert all microdata elements in json-ld format.
Need to filter to only convert top-itemscope elements and further to only process 
itemprops that are direct child of current itemscope element and not process values
that contain other itemprop elements
*/
function convert(){
  var type = [];
  var item = [];
  $('[itemscope]').map(function(i, el){
    var im = {};
    if($(el).parents("[itemscope]").length == 0){ 
      type.push($(this).attr("itemtype"));
      $(el).find("[itemprop]").attr("itemprop", function(i, key) {
        if ($(this).parents("[itemscope]").get(0) == el && $(this).has("[itemprop]").length == 0){ 
          val = $(this).attr("href") || $(this).prop("content") || $(this).text() || $(this).attr("src");
          im = append(im,key,val);
          im["@type"] = $(el).attr("itemtype");
        }
        if ($(this).is("[itemscope]") && $(this).is("[itemprop]")) {
          var subitem = {};
          subitem["@type"] = $(this).attr("itemtype");
          type.push($(this).attr("itemtype"));
          $(this).find("[itemprop]").attr("itemprop", function(i, subkey) {
            subval = $(this).attr("href") || $(this).prop("content") || $(this).text() || $(this).attr("src");
            subitem = append(subitem,subkey,subval);
          });
          im  =  append(im,$(this).attr("itemprop"),subitem);
        }
      });
      item.push(im);
    }
  });
  console.log(type);
  if(item.length>1){
    jsonld={}
    jsonld["@context"] = "http://schema.org/";
    jsonld['@graph'] = item
    return jsonld
  }else{
    item[0]['@context'] = "http://schema.org/";
    return item[0];
  }

}

output = convert();
console.log(JSON.stringify(output, null, 2));
$("body").prepend(
  "<pre>" + JSON.stringify(output, null, 2) + "<pre>"
);

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
item = [];
$('[itemscope]').map(function(i,el){
  im={}
  if($(el).parents("[itemscope]").length == 0){
    $(el).find("[itemprop]").attr("itemprop", function(i, key) {
      if ($(this).parents("[itemscope]").get(0) == el && $(this).has("[itemprop]").length==0){
        val = $(this).attr("href") || $(this).prop("content") || $(this).text() || $(this).attr("src");
        im = append(im,key,val);
        im["@type"] = $(el).attr("itemtype");
      }
      if ($(this).is("[itemscope]") && $(this).is("[itemprop]")) {
        var subitem = {};
        subitem["@type"] = $(this).attr("itemtype");
        $(this).find("[itemprop]").attr("itemprop", function(i, subkey) {
          subval = $(this).attr("href") || $(this).prop("content") || $(this).text() || $(this).attr("src");
          subitem = append(subitem,subkey,subval);
        });
        im  =  append(im,$(this).attr("itemprop"),subitem);
      };
      
    });
    item.push(im);
  }
  
});
console.log(JSON.stringify(item[0], null, 2));
$("body").prepend(
  "<pre>1<br>" + JSON.stringify(item, null, 2) + "<pre>"
);

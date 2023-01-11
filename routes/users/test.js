var items = [2, 2, 2, 6];
for (var i = 1; i < items.length; i++) {
  var item1 = items[i - 1];
  var item2 = items[i];
  if (item1 === item2) {
    console.log(item1, "and", item2, "are equivalent");
		i = i+1
  } else if (item1 == item2) {
    console.log(item1, "and", item2, "are equal but not equivalent");
  } else {
    console.log(item1, "and", item2, "are neither equal nor equivalent");
  }

}

$(document).ready(function () {

  //Global Variables
  var mainRNG = null;
  var qtd = null;
  var breakSort = false;
  var sortActive = false;
  var delay = {
    bubble: 10,
    quick: 500,
    selection: 10,
    radix: 10,
    insertion: 20
  };
  var curDelay = null;

  //Ao Carregar
  main();
  $(".delayInput").val(delay.bubble);

  function main() {

    if (qtd == null || mainRNG == null) {
      qtd = $(".numSelected").find(".num").text();
      mainRNG = generateNumbers(qtd);

      createBars(mainRNG);
    } else {
      if (qtd != $(".numSelected").find(".num").text()) {
        qtd = null;
        $(".barsContent").empty();
        main();
      } else {
        mainRNG = generateNumbers(qtd);
        updateBars(mainRNG);
      }
    }
  };



  //Mudando o numero de elementos
  $(".numBox").click(function () {
    breakSort = sortActive ? true : false;
    $(".numBox").removeClass("numSelected");
    $(this).addClass("numSelected");
    main();
  });


  //Mudando Sorting Algorithm Ativo
  $(".sortingAlgo").click(function () {
    breakSort = sortActive ? true : false;
    $(".sortingAlgo").removeClass("algoSelected");
    $(this).addClass("algoSelected");
    $(".delayInput").val(delay[$(this).attr("sort")]);
    main();
  });


  //Retorna Array de n numeros aleatorios de 1 a 100
  function generateNumbers(n) {
    return Array.from({
      length: n
    }, () => Math.ceil(Math.random() * 100));
  }

  //Criar as Barras do "grafico"
  function createBars(a) {
    for (var i = 0; i < a.length; i++) {
      var percent = 100 / a.length;
      var bar = '<div class="bar" style="width: calc(' + percent + '% - 2px); height: ' + a[i] + '%"></div>';
      $(".barsContent").append(bar);
    }
  }

  //Atualizar as barras que ja estao na tela, com novo Array
  function updateBars(a) {
    $(".bar").css("transition", "all .2s");
    for (var i = 0; i < a.length; i++) {
      $(".bar").eq(i).css("height", a[i] + "%");
    }
    setTimeout(function () {
      $(".bar").css("transition", "");
    }, 300);
  }


  //INICIAR SORT
  $(".sortBtn").click(function () {
    curDelay = $(".delayInput").val();

    var toRun = $(".algoSelected").attr("sort") + "Sort(mainRNG)";

    console.log("sortActive: " + sortActive + " breakSort: " + breakSort);

    if (!sortActive) {
      eval(toRun);
    }
  });


  function redUp(a) {
    $(".bar").eq(a).addClass("activeBar");
  }

  function redDown(a) {
    $(".bar").eq(a).removeClass("activeBar");
  }

  //Swaps 2 bars heights
  function swapBars(a, b) {
    var ah = $(".bar").eq(a).css("height");
    $(".bar").eq(a).css("height", $(".bar").eq(b).css("height"));
    $(".bar").eq(b).css("height", ah);
  }

  function greenUp(a) {
    $(".bar").eq(a).addClass("pivotBar");
  }

  function greenDown(a) {
    $(".bar").eq(a).removeClass("pivotBar");
  }


  //BUBBLE SORT COM DELAY
  function bubbleSort(items) {
    sortActive = true;
    var i = 0;
    var j = 0;

    (function nextIteration() {
      if (j >= items.length - i - 1) {
        j = 0;

        i++;
      }
      if (i < items.length) {
        redUp(j);
        redUp(j + 1);
        redDown(j - 1);
        if (items[j] > items[j + 1]) {
          
          var temp = items[j];
          items[j] = items[j + 1];
          items[j + 1] = temp;

          swapBars(j, j + 1);
        }
        redDown(items.length - i);
        redDown(items.length - i - 1);
        j++;
        if (breakSort) {
          breakSort = false;
          i = items.length;
        }
        if (!breakSort)
          setTimeout(nextIteration, curDelay);
      } else {
        $(".bar").removeClass("activeBar");
        sortActive = false;
      }
    })();
  }



  //QUICK SORT

  function partition(items, left, right) {
    var pivot = items[Math.floor((right + left) / 2)], //middle element
      i = left, //left pointer
      j = right; //right pointer
    //greenUp(Math.floor((right + left) / 2));
    while (i <= j) {
      while (items[i] < pivot) {
        i++;
      }
      while (items[j] > pivot) {
        j--;
      }
      if (i <= j) {

        var temp = items[j];
        items[j] = items[i];
        items[i] = temp;
        if (sortActive)
          swapBars(j, i);
        i++;
        j--;
      }

    }
    return i;
  }

  function actualQuickSort(items, left, right) {
    var index;
    setTimeout(function () {
      if (items.length > 1 && !breakSort) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
          actualQuickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
          actualQuickSort(items, index, right);
        }
      } else {
        console.log("broken");
        sortActive = false;
        breakSort = false;
      }
    }, curDelay);
    if (sorted(items)) {
      sortActive = false;
    }
  }

  function quickSort(items) {
    sortActive = true;
    actualQuickSort(items, 0, items.length - 1);
  }





  // SELECTION SORT
  async function selectionSort(items) {
    sortActive = true;
    let n = items.length;
    var oldMin = 0;
    for (let i = 0; i < n; i++) {

      // Finding the smallest number in the subarray
      let min = i;
      for (let j = i + 1; j < n; j++) {
        redUp(j);
        await new Promise((resolve) =>
          setTimeout(() => {
            resolve();
          }, curDelay)
        );
        if (items[j] < items[min]) {
          min = j;
          greenDown(oldMin);
          greenUp(j);
          oldMin = min;
        }
        redDown(j);
        if (breakSort)
          break;
      }
      greenDown(oldMin);
      if (min != i) {
        
        let tmp = items[i];
        items[i] = items[min];
        items[min] = tmp;
        swapBars(i, min);
      }
      if (breakSort)
        break;
    }
    console.log(items);
    $(".bar").removeClass("activeBar");
    $(".bar").removeClass("pivotBar");
    breakSort = false;
    sortActive = false;
  }

  //Verifica se esta Ordenado
  function sorted(items) {
    for (var i = 0; i < items.length - 1; i++) {
      if (items[i] > items[i + 1])
        return false;
    }
    return true;
  }





  //RADIX SORT
  async function countingSort(items, size, place) {
    if(breakSort) return;

    let output = new Array(size + 1).fill(0);
    let max = Math.max(...items);

    let freq = new Array(max + 1).fill(0);

    // Calculate count of elements
    for (let i = 0; i < size; i++) {
      const num = Math.floor(items[i] / place) % 10;
      freq[num]++;
    }

    // Calculate cummulative count
    for (let i = 1; i < 10; i++) {
      freq[i] += freq[i - 1];
    }

    // Place the elements in sorted order
    for (let i = size - 1; i >= 0; i--) {

      const num = Math.floor(items[i] / place) % 10;
      output[freq[num] - 1] = items[i];

      freq[num]--;

      redDown(i + 1);
      redUp(i);

      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, curDelay)
      );

    }
    redDown(0);

    placeBars(output);
    
    //Copy the output array
    for (let i = 0; i < size; i++) {
      items[i] = output[i];
    }

  }

  async function radixSort(items) {
    sortActive = true;
    var size = items.length;

    //Get the max element
    let max = Math.max(...items);

    //Sort the array using counting sort
    for (let i = 1; parseInt(max / i) > 0; i *= 10) {
      await countingSort(items, size, i);
    }

    sortActive = false;
  }

  //Atualiza todas as barras a partir de um Array
  function placeBars(items) {
    for (var i = 0; i < items.length; i++) {
      $(".bar").eq(i).css("height", items[i] + "%");
    }
  }







  //Insertion Sort
  async function insertionSort(items){

    sortActive = true;

    var i;
    for(var j = 1; j < items.length; j++){
      redDown(j-1);
      redUp(j);
      var chave = items[j];
      i = j - 1;
      while(i >= 0 && items[i] > chave){

        if(breakSort){
          greenDown(i + 1);
          redDown(j);
          sortActive = false;
          breakSort = false;
          return;
        }

        greenDown(i + 1);
        greenUp(i);
        await new Promise((resolve) =>
          setTimeout(() => {
            resolve();
          }, curDelay)
        );
        items[i + 1] = items[i];
        i = i - 1;
        placeBars(items);
      }
      greenDown(i + 1);
      items[i + 1] = chave;
    }
    redDown(items.length - 1);
    sortActive = false;
    breakSort = false;
  }
});


//Filtro para Input aceitar apenas numeros
function numberFilter(e) { 
  var ASCIICode = (e.which) ? e.which : e.keyCode 
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) 
      return false; 
  return true; 
} 
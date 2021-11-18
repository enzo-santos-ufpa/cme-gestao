$(function () {
  // === Prepare the chart data ===/
  var sin = [],
    cos = [];
  for (var i = 0; i < 14; i += 0.5) {
    sin.push([i, Math.sin(i)]);
    cos.push([i, Math.cos(i)]);
  }
  // === Prepare the chart data ===/
  var sin = [],
    cos = [];
  for (var i = 0; i < 14; i += 0.5) {
    sin.push([i, Math.sin(i)]);
    cos.push([i, Math.cos(i)]);
  }

  // === Make chart === //
  var plot = $.plot(
    $(".chart"),
    [
      { data: sin, label: "sin(x)", color: "#ee7951" },
      { data: cos, label: "cos(x)", color: "#4fb9f0" },
    ],
    {
      series: {
        lines: { show: true },
        points: { show: true },
      },
      grid: { hoverable: true, clickable: true },
      yaxis: { min: -1.6, max: 1.6 },
    }
  );

  // === Point hover in chart === //
  var previousPoint = null;
  $(".chart").bind("plothover", function (event, pos, item) {
    if (item) {
      if (previousPoint != item.dataIndex) {
        previousPoint = item.dataIndex;

        $("#tooltip").fadeOut(200, function () {
          $(this).remove();
        });
        var x = item.datapoint[0].toFixed(2),
          y = item.datapoint[1].toFixed(2);

        maruti.flot_tooltip(
          item.pageX,
          item.pageY,
          item.series.label + " of " + x + " = " + y
        );
      }
    } else {
      $("#tooltip").fadeOut(200, function () {
        $(this).remove();
      });
      previousPoint = null;
    }
  });

  $.plot($(".school-quantity"), [
    {label: "EMEI", data: 28},
    {label: "EMEIF", data: 41},
    {label: "UEI", data: 28},
    {label: "EMEF", data: 40},
    {label: "OSC", data: 20},
    {label: "Privadas", data: 26},
  ], {
    series: {
      pie: {
        show: true,
        label: {
          show: true,
          formatter: function (label, series) {
            return (
                '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' +
                label +
                "<br/>" +
                Math.round(series.percent) +
                "%</div>"
            );
          },
          background: {
            opacity: 0.5,
            color: "#000",
          },
        },
      },
      legend: {
        show: true,
      },
    },
  });

  const data0 = [["January", 10], ["February", 8], ["March", 4], ["April", 13], ["May", 17], ["June", 9]];
  const data1 = [["January", 1], ["February", 5], ["March", 6], ["April", 3], ["May", 37], ["June", 39]];
  $.plot($(".bars"), [
    {label: "Sem pendências", color: "green", data: data0, bars: {show: true, barWidth: 0.5, align: "left", order: 1}},
    {label: "Com pendências", color: "red", data: data1, bars: {show: true, barWidth: 0.5, align: "right", order: 2}},
  ], {
    series: {
      bars: {
        show: true,
        barWidth: 0.15,
        align: "center",
      }
    },
    ticks: [
      [0, "Jan"],
      [1, "Feb"],
    ],
    xaxis: {
      mode: "categories",
      tickLength: 1,
    }
  });
});

maruti = {
  // === Tooltip for flot charts === //
  flot_tooltip: function (x, y, contents) {
    $('<div id="tooltip">' + contents + "</div>")
      .css({
        top: y + 5,
        left: x + 5,
      })
      .appendTo("body")
      .fadeIn(200);
  },
};

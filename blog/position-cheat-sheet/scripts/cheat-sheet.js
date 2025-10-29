(function () {
  const rectCanvas = document.getElementById("bounding-rect-canvas");
  const rectCtx = rectCanvas.getContext("2d");

  let hoveredPosition = null;
  let animationId = null;

  // Position configurations with CSS measurement info
  const positions = {
    "top-left": {
      triangleX: 220,
      triangleY: 140,
      css: "bottom: offsetBottom; left: triggerLeft;",
      measurements: [
        { type: "triggerLeft", from: { x: 0, y: 200 }, to: { x: 220, y: 200 } },
        { type: "offsetBottom", from: { x: 300, y: 400 }, to: { x: 300, y: 160 } },
      ],
    },
    "top-center": {
      triangleX: 300,
      triangleY: 140,
      css: "bottom: offsetBottom; left: horizontalCenter; transform: translateX(-50%);",
      measurements: [
        { type: "horizontalCenter", from: { x: 0, y: 200 }, to: { x: 300, y: 200 } },
        { type: "offsetBottom", from: { x: 300, y: 400 }, to: { x: 300, y: 160 } },
      ],
    },
    "top-right": {
      triangleX: 380,
      triangleY: 140,
      css: "bottom: offsetBottom; right: triggerRight;",
      measurements: [
        { type: "offsetBottom", from: { x: 300, y: 400 }, to: { x: 300, y: 160 } },
        { type: "triggerRight", from: { x: 600, y: 200 }, to: { x: 380, y: 200 } },
      ],
    },
    "right-top": {
      triangleX: 400,
      triangleY: 160,
      css: "top: triggerTop; left: offsetLeft;",
      measurements: [
        { type: "offsetLeft", from: { x: 0, y: 200 }, to: { x: 380, y: 200 } },
        { type: "triggerTop", from: { x: 300, y: 0 }, to: { x: 300, y: 160 } },
      ],
    },
    "right-center": {
      triangleX: 400,
      triangleY: 200,
      css: "top: verticalCenter; left: offsetLeft; transform: translateY(-50%);",
      measurements: [
        { type: "offsetLeft", from: { x: 0, y: 200 }, to: { x: 380, y: 200 } },
        { type: "verticalCenter", from: { x: 300, y: 0 }, to: { x: 300, y: 200 } },
      ],
    },
    "right-bottom": {
      triangleX: 400,
      triangleY: 240,
      css: "bottom: triggerBottom; left: offsetLeft;",
      measurements: [
        { type: "offsetLeft", from: { x: 0, y: 200 }, to: { x: 380, y: 200 } },
        { type: "triggerBottom", from: { x: 300, y: 400 }, to: { x: 300, y: 240 } },
      ],
    },
    "bottom-left": {
      triangleX: 220,
      triangleY: 260,
      css: "top: offsetTop; left: triggerLeft;",
      measurements: [
        { type: "offsetTop", from: { x: 300, y: 0 }, to: { x: 300, y: 240 } },
        { type: "triggerLeft", from: { x: 0, y: 200 }, to: { x: 220, y: 200 } },
      ],
    },
    "bottom-center": {
      triangleX: 300,
      triangleY: 260,
      css: "top: offsetTop; left: horizontalCenter; transform: translateX(-50%);",
      measurements: [
        { type: "offsetTop", from: { x: 300, y: 0 }, to: { x: 300, y: 240 } },
        { type: "horizontalCenter", from: { x: 0, y: 200 }, to: { x: 300, y: 200 } },
      ],
    },
    "bottom-right": {
      triangleX: 380,
      triangleY: 260,
      css: "top: offsetTop; right: triggerRight;",
      measurements: [
        { type: "offsetTop", from: { x: 300, y: 0 }, to: { x: 300, y: 240 } },
        { type: "triggerRight", from: { x: 600, y: 200 }, to: { x: 380, y: 200 } },
      ],
    },
    "left-top": {
      triangleX: 200,
      triangleY: 160,
      css: "top: triggerTop; right: offsetRight;",
      measurements: [
        { type: "offsetRight", from: { x: 600, y: 200 }, to: { x: 220, y: 200 } },
        { type: "triggerTop", from: { x: 300, y: 0 }, to: { x: 300, y: 160 } },
      ],
    },
    "left-center": {
      triangleX: 200,
      triangleY: 200,
      css: "top: verticalCenter; right: offsetRight; transform: translateY(-50%);",
      measurements: [
        { type: "offsetRight", from: { x: 600, y: 200 }, to: { x: 220, y: 200 } },
        { type: "verticalCenter", from: { x: 300, y: 0 }, to: { x: 300, y: 200 } },
      ],
    },
    "left-bottom": {
      triangleX: 200,
      triangleY: 240,
      css: "bottom: triggerBottom; right: offsetRight;",
      measurements: [
        { type: "offsetRight", from: { x: 600, y: 200 }, to: { x: 220, y: 200 } },
        { type: "triggerBottom", from: { x: 300, y: 400 }, to: { x: 300, y: 240 } },
      ],
    },
  };

  // Update the diamond positioning in the drawBoundingRectDiagram function
  function drawBoundingRectDiagram() {
    // Clear canvas
    rectCtx.clearRect(0, 0, rectCanvas.width, rectCanvas.height);

    // Set background color (light gray)
    rectCtx.fillStyle = "#e8e8e8";
    rectCtx.fillRect(0, 0, rectCanvas.width, rectCanvas.height);

    // Trigger element properties
    const triggerRect = {
      x: 220,
      y: 160,
      width: 160,
      height: 80,
    };

    // Draw the trigger element
    rectCtx.fillStyle = "white";
    rectCtx.fillRect(triggerRect.x, triggerRect.y, triggerRect.width, triggerRect.height);
    rectCtx.strokeStyle = "#666";
    rectCtx.lineWidth = 2;
    rectCtx.strokeRect(triggerRect.x, triggerRect.y, triggerRect.width, triggerRect.height);

    // Draw "Trigger" text
    rectCtx.fillStyle = "#333";
    rectCtx.font = "18px Arial";
    rectCtx.textAlign = "center";
    rectCtx.fillText("Trigger", triggerRect.x + triggerRect.width / 2, triggerRect.y + triggerRect.height / 2 + 6);

    // Draw coordinate labels
    rectCtx.font = "18px Arial";
    rectCtx.textAlign = "left";
    rectCtx.fillText("(0,0)", 10, 20);
    rectCtx.textAlign = "right";
    rectCtx.fillText("(innerWidth,innerHeight)", rectCanvas.width - 10, rectCanvas.height - 10);

    // Function to draw a diamond
    function drawDiamond(x, y, size, color) {
      rectCtx.fillStyle = color;
      rectCtx.beginPath();
      rectCtx.moveTo(x, y - size);
      rectCtx.lineTo(x + size, y);
      rectCtx.lineTo(x, y + size);
      rectCtx.lineTo(x - size, y);
      rectCtx.closePath();
      rectCtx.fill();
    }

    // Function to draw a triangle
    function drawTriangle(x, y, size, direction, color) {
      rectCtx.fillStyle = color;
      rectCtx.beginPath();

      if (direction === "up") {
        rectCtx.moveTo(x, y - size);
        rectCtx.lineTo(x - size, y + size);
        rectCtx.lineTo(x + size, y + size);
      } else if (direction === "down") {
        rectCtx.moveTo(x, y + size);
        rectCtx.lineTo(x - size, y - size);
        rectCtx.lineTo(x + size, y - size);
      } else if (direction === "left") {
        rectCtx.moveTo(x - size, y);
        rectCtx.lineTo(x + size, y - size);
        rectCtx.lineTo(x + size, y + size);
      } else if (direction === "right") {
        rectCtx.moveTo(x + size, y);
        rectCtx.lineTo(x - size, y - size);
        rectCtx.lineTo(x - size, y + size);
      }

      rectCtx.closePath();
      rectCtx.fill();
    }

    // Function to draw measurement line
    function drawMeasurementLine(from, to, label, color = "#0088ff") {
      rectCtx.strokeStyle = color;
      rectCtx.lineWidth = 2;
      rectCtx.setLineDash([]);

      // Draw main line
      rectCtx.beginPath();
      rectCtx.moveTo(from.x, from.y);
      rectCtx.lineTo(to.x, to.y);
      rectCtx.stroke();

      // Draw end caps
      const isHorizontal = Math.abs(to.x - from.x) > Math.abs(to.y - from.y);
      const capSize = 8;

      if (isHorizontal) {
        // Horizontal line - vertical end caps
        rectCtx.beginPath();
        rectCtx.moveTo(from.x, from.y - capSize);
        rectCtx.lineTo(from.x, from.y + capSize);
        rectCtx.moveTo(to.x, to.y - capSize);
        rectCtx.lineTo(to.x, to.y + capSize);
        rectCtx.stroke();
      } else {
        // Vertical line - horizontal end caps
        rectCtx.beginPath();
        rectCtx.moveTo(from.x - capSize, from.y);
        rectCtx.lineTo(from.x + capSize, from.y);
        rectCtx.moveTo(to.x - capSize, to.y);
        rectCtx.lineTo(to.x + capSize, to.y);
        rectCtx.stroke();
      }

      // Draw label
      rectCtx.fillStyle = color;
      rectCtx.font = "12px Arial";
      rectCtx.textAlign = "center";
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;

      if (isHorizontal) {
        rectCtx.fillText(label, midX, midY - 10);
      } else {
        rectCtx.save();
        rectCtx.translate(midX - 10, midY);
        rectCtx.rotate(-Math.PI / 2);
        rectCtx.fillText(label, 0, 0);
        rectCtx.restore();
      }
    }

    const diamondSize = 8;
    const triangleSize = 10;

    // Top positions (red diamonds) - positioned on the top edge
    drawDiamond(triggerRect.x, triggerRect.y, diamondSize, "#D32626"); // top-left
    drawDiamond(triggerRect.x + triggerRect.width / 2, triggerRect.y, diamondSize, "#D32626"); // top-center
    drawDiamond(triggerRect.x + triggerRect.width, triggerRect.y, diamondSize, "#D32626"); // top-right

    // Bottom positions (yellow diamonds) - positioned on the bottom edge
    drawDiamond(triggerRect.x, triggerRect.y + triggerRect.height, diamondSize, "#FFBB00"); // bottom-left
    drawDiamond(triggerRect.x + triggerRect.width / 2, triggerRect.y + triggerRect.height, diamondSize, "#FFBB00"); // bottom-center
    drawDiamond(triggerRect.x + triggerRect.width, triggerRect.y + triggerRect.height, diamondSize, "#FFBB00"); // bottom-right

    // Left positions (green diamonds) - positioned on the left edge
    drawDiamond(triggerRect.x, triggerRect.y + triggerRect.height / 2, diamondSize, "#66CA42"); // left-center

    // Right positions (blue diamonds) - positioned on the right edge
    drawDiamond(triggerRect.x + triggerRect.width, triggerRect.y + triggerRect.height / 2, diamondSize, "#427BCA"); // right-center

    // All triangles with hover colors
    const topLeftTriangleColor = hoveredPosition === "top-left" ? "#333" : "#999";
    const topCenterTriangleColor = hoveredPosition === "top-center" ? "#333" : "#999";
    const topRightTriangleColor = hoveredPosition === "top-right" ? "#333" : "#999";
    const rightTopTriangleColor = hoveredPosition === "right-top" ? "#333" : "#999";
    const rightCenterTriangleColor = hoveredPosition === "right-center" ? "#333" : "#999";
    const rightBottomTriangleColor = hoveredPosition === "right-bottom" ? "#333" : "#999";
    const bottomLeftTriangleColor = hoveredPosition === "bottom-left" ? "#333" : "#999";
    const bottomCenterTriangleColor = hoveredPosition === "bottom-center" ? "#333" : "#999";
    const bottomRightTriangleColor = hoveredPosition === "bottom-right" ? "#333" : "#999";
    const leftTopTriangleColor = hoveredPosition === "left-top" ? "#333" : "#999";
    const leftCenterTriangleColor = hoveredPosition === "left-center" ? "#333" : "#999";
    const leftBottomTriangleColor = hoveredPosition === "left-bottom" ? "#333" : "#999";

    // Top triangles (pointing down)
    drawTriangle(triggerRect.x, triggerRect.y - 20, triangleSize, "down", topLeftTriangleColor);
    drawTriangle(
      triggerRect.x + triggerRect.width / 2,
      triggerRect.y - 20,
      triangleSize,
      "down",
      topCenterTriangleColor,
    );
    drawTriangle(triggerRect.x + triggerRect.width, triggerRect.y - 20, triangleSize, "down", topRightTriangleColor);

    // Right triangles (pointing left)
    drawTriangle(triggerRect.x + triggerRect.width + 20, triggerRect.y, triangleSize, "left", rightTopTriangleColor);
    drawTriangle(
      triggerRect.x + triggerRect.width + 20,
      triggerRect.y + triggerRect.height / 2,
      triangleSize,
      "left",
      rightCenterTriangleColor,
    );
    drawTriangle(
      triggerRect.x + triggerRect.width + 20,
      triggerRect.y + triggerRect.height,
      triangleSize,
      "left",
      rightBottomTriangleColor,
    );

    // Bottom triangles (pointing up)
    drawTriangle(triggerRect.x, triggerRect.y + triggerRect.height + 20, triangleSize, "up", bottomLeftTriangleColor);
    drawTriangle(
      triggerRect.x + triggerRect.width / 2,
      triggerRect.y + triggerRect.height + 20,
      triangleSize,
      "up",
      bottomCenterTriangleColor,
    );
    drawTriangle(
      triggerRect.x + triggerRect.width,
      triggerRect.y + triggerRect.height + 20,
      triangleSize,
      "up",
      bottomRightTriangleColor,
    );

    // Left triangles (pointing right)
    drawTriangle(triggerRect.x - 20, triggerRect.y, triangleSize, "right", leftTopTriangleColor);
    drawTriangle(
      triggerRect.x - 20,
      triggerRect.y + triggerRect.height / 2,
      triangleSize,
      "right",
      leftCenterTriangleColor,
    );
    drawTriangle(
      triggerRect.x - 20,
      triggerRect.y + triggerRect.height,
      triangleSize,
      "right",
      leftBottomTriangleColor,
    );

    // Draw measurements if hovering over any position
    if (hoveredPosition && positions[hoveredPosition]) {
      const pos = positions[hoveredPosition];

      // Draw measurement lines first
      pos.measurements.forEach((measurement) => {
        drawMeasurementLine(measurement.from, measurement.to, measurement.type);
      });

      // Calculate CSS info box dimensions - different widths for different positions
      const cssLines = pos.css.split(";").filter((line) => line.trim());
      let boxWidth;

      // Use narrower boxes for left and right positions
      if (hoveredPosition.includes("left-") || hoveredPosition.includes("right-")) {
        boxWidth = 200; // Narrower for left/right positions
      } else {
        boxWidth = 280; // Standard width for top/bottom positions
      }

      const boxHeight = 50 + cssLines.length * 18;
      let boxX, boxY;

      // Position info box based on the hover position to match tooltip alignment
      if (hoveredPosition.includes("top-")) {
        // Position above trigger
        boxY = triggerRect.y - boxHeight - 30;
        if (hoveredPosition === "top-left") {
          boxX = triggerRect.x;
        } else if (hoveredPosition === "top-center") {
          boxX = triggerRect.x + triggerRect.width / 2 - boxWidth / 2;
        } else {
          // top-right
          boxX = triggerRect.x + triggerRect.width - boxWidth;
        }
      } else if (hoveredPosition.includes("bottom-")) {
        // Position below trigger
        boxY = triggerRect.y + triggerRect.height + 30;
        if (hoveredPosition === "bottom-left") {
          boxX = triggerRect.x;
        } else if (hoveredPosition === "bottom-center") {
          boxX = triggerRect.x + triggerRect.width / 2 - boxWidth / 2;
        } else {
          // bottom-right
          boxX = triggerRect.x + triggerRect.width - boxWidth;
        }
      } else if (hoveredPosition.includes("right-")) {
        // Position to the right of trigger
        boxX = triggerRect.x + triggerRect.width + 30;
        if (hoveredPosition === "right-top") {
          boxY = triggerRect.y;
        } else if (hoveredPosition === "right-center") {
          boxY = triggerRect.y + triggerRect.height / 2 - boxHeight / 2;
        } else {
          // right-bottom
          boxY = triggerRect.y + triggerRect.height - boxHeight;
        }
      } else if (hoveredPosition.includes("left-")) {
        // Position to the left of trigger
        boxX = triggerRect.x - boxWidth - 30;
        if (hoveredPosition === "left-top") {
          boxY = triggerRect.y;
        } else if (hoveredPosition === "left-center") {
          boxY = triggerRect.y + triggerRect.height / 2 - boxHeight / 2;
        } else {
          // left-bottom
          boxY = triggerRect.y + triggerRect.height - boxHeight;
        }
      }

      // Ensure box stays within canvas bounds
      boxX = Math.max(10, Math.min(boxX, rectCanvas.width - boxWidth - 10));
      boxY = Math.max(10, Math.min(boxY, rectCanvas.height - boxHeight - 10));

      // Draw CSS info box
      rectCtx.fillStyle = "rgba(255, 255, 255, 0.95)";
      rectCtx.fillRect(boxX, boxY, boxWidth, boxHeight);
      rectCtx.strokeStyle = "#0088ff";
      rectCtx.lineWidth = 2;
      rectCtx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      // Draw position name as title
      rectCtx.fillStyle = "#0088ff";
      rectCtx.font = "16px Arial";
      rectCtx.textAlign = "left";
      rectCtx.fillText(hoveredPosition, boxX + 10, boxY + 25);

      // Draw CSS properties
      rectCtx.fillStyle = "#333";
      rectCtx.font = "14px Arial";

      cssLines.forEach((line, index) => {
        const cleanLine = line.trim();
        if (cleanLine) {
          rectCtx.fillText(cleanLine + (index < cssLines.length - 1 ? ";" : ""), boxX + 10, boxY + 50 + index * 18);
        }
      });
    }
  }

  // Function to check if mouse is over a triangle
  function isPointInTriangle(x, y, triangleX, triangleY, size) {
    const dx = Math.abs(x - triangleX);
    const dy = Math.abs(y - triangleY);
    return dx <= size && dy <= size;
  }

  // Event listeners
  rectCanvas.addEventListener("mousemove", (e) => {
    const rect = rectCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (rectCanvas.width / rect.width);
    const y = (e.clientY - rect.top) * (rectCanvas.height / rect.height);

    let newHoveredPosition = null;

    // Check all positions for hover
    for (const [positionName, positionData] of Object.entries(positions)) {
      if (isPointInTriangle(x, y, positionData.triangleX, positionData.triangleY, 10)) {
        newHoveredPosition = positionName;
        rectCanvas.style.cursor = "pointer";
        break;
      }
    }

    if (!newHoveredPosition) {
      rectCanvas.style.cursor = "default";
    }

    if (newHoveredPosition !== hoveredPosition) {
      hoveredPosition = newHoveredPosition;
      drawBoundingRectDiagram();
    }
  });

  rectCanvas.addEventListener("mouseleave", () => {
    if (hoveredPosition) {
      hoveredPosition = null;
      drawBoundingRectDiagram();
    }
    rectCanvas.style.cursor = "default";
  });

  // Draw the diagram
  drawBoundingRectDiagram();

  // Handle canvas resize
  function resizeBoundingRectCanvas() {
    const container = rectCanvas.parentElement;
    const maxWidth = container.clientWidth;
    if (maxWidth < 600) {
      rectCanvas.style.width = "100%";
      rectCanvas.style.height = "auto";
    }
  }

  window.addEventListener("resize", resizeBoundingRectCanvas);
  resizeBoundingRectCanvas();
})();

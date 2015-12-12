<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    	<title>Dr Ecco</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" type="text/css" href="styles.css" />
		<link rel="stylesheet" type="text/css" href="../../style.css" media="screen" />
    </head>
    <body>
        <div class="post" style="position:absolute; left:0; top:0%; height:5%;width:80%">
		<h1 class="title">Gravitational Voronoi</h1>
	</div>
	<div style="position:absolute; height:15%; top:5%;width:80%">
		<div class="instr">
			<b>Instructions:</b> Instructions and any reference links etc. </p>
		</div>
		<div class="instr">
			<b>Rules of the game:</b> 
			<ul>
			<li><span style="color:red"> Rule #1: </span>Blah blah .</li>
			<li><span style="color:red"> Rule #2: </span>Blah blah .</li>
	    		</ul>
		</div>
		<div>
      	    <b>The object of the game is to ......</b>. The winner is the one who blah blah...
		</div>
	</div>

       <div id="gameArea" style="position:absolute;top:22%; height:60%; width:90%">
            <div id="left-pane" style="position:absolute; top:0;left:0;height:90%;width:90%">
                <!-- canvas id="canvas" style="width:90%;height:100%" width="500" height="500" -->
                <canvas id="canvas" style="width:90%;height:100%" width="500" height="500">
                    Your browser does not support the HTML5 canvas tag.
                </canvas>
            </div>
            <div id="right-pane" style="position:absolute;top:0;left:82%;height:90%;width:20%">
                <div id="mousePosition">x:? y:?</div>
                <div>
                    <button id="reset" type="button">Reset</button>
                </div>
                <div id="scores"></div>
                <div id="message">Player 1 to move</div>
                <div>
		    <script>
			function postScore(ws, wr) {
			  if (!wr)
				wr = “guest”;
			  if (wr == "") 
				wr = "guest";
			  document.location.href="/drecco/index.php?task=f15Grav&winner="+wr+"&ws="+ws;
			}
		    </script>
                    <button id="score" onClick="postScore('2300', 'vsm')" type="button">Save Score</button>
                </div>
            </div>
        </div>
	<script type="text/javascript" src="logic.js"></script>
    <div class="post" style="position:absolute; top:80%; height:10%">
	<h2 class="title">Last 10 scores</h2>
    <?php

      // functions.php in case of an opening in the same window
      // ../../functions.php in case of an opening in a new window

      include '../../lastScores.php';

      getScores("f15Grav");

    ?>
    </div>
    </body>
</html>


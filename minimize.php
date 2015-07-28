<?php

$paths = array('mcc.js', '*/*.js');
$files = array();
foreach ($paths as $path) {
  $data = glob($path);
  foreach ($data as $file) {
    if (!in_array($file, $files)) {
      array_push($files, $file);
    }
  }
}

$string = '';
foreach ($files as $file) {
  $string .= PHP_EOL . file_get_contents($file);
}

file_put_contents('mcc-full.js', $string);

/* Compilation levels
 * 
 * WHITESPACE_ONLY
 * SIMPLE_OPTIMIZATIONS
 * ADVANCED_OPTIMIZATIONS
 */

// Debug errors in: http://closure-compiler.appspot.com/home

// now compile
$query = array('js_code' => $string,    
    'compilation_level' => 'WHITESPACE_ONLY',
    'output_format' => 'text',
    'output_info' => 'compiled_code');
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://closure-compiler.appspot.com/compile');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($query));
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($query));
$res = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);


file_put_contents('mcc-min.js', $res);

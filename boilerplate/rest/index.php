<?php

date_default_timezone_set('UTC');

session_cache_limiter(false);
session_start();

require_once '../php/vendor/autoload.php';

require_once 'config.php';

// set here debug
$debugLocalhost = false;
$debug = $_SERVER['SERVER_NAME'] == 'localhost' ? $debugLocalhost : false;

if (!$debug) {
  $app = new \Slim\Slim(array('debug' => false));
  $app->error(function(\Exception $e) use ($app) {
    $msg = $e->getMessage();
    $app->contentType('application/json;charset=utf-8');
    $code = 500;
    if (is_a($e, '\mcc\obj\mccException')) {
      $dict = $e->getDictionaryCode();
      $data = array('dict' => $dict,
          'msg' => $msg,
          'params' => $e->getParams());
      $code = $e->getCode();
    } else {
      $dict = "ERROR_UNKNOWN";
      $data = array('dict' => $dict, 'msg' => 'Unknown error. Perhaps you need to debug.');
    }
    $app->halt($code, json_encode($data, JSON_NUMERIC_CHECK));
  });
} else {
  $app = new \Slim\Slim(array('debug' => true));
}

// file service configuration
$filesConfig = array(
    'servers' => array('localhost' =>
        array('path' => __DIR__ . '/',
            'relpath' => 'uploads/local/')
    ),
    'path' => __DIR__ . '/',
    'relpath' => 'uploads/'
);
new \mcc\rest\files('/private/files', $filesConfig);

new \mcc\rest\news\pri('/private/news');
new \mcc\rest\news\pub('/news');
new \mcc\rest\templates\pub('/mcc/templates');
new \mcc\rest\dictionary('/dict');
new \mcc\rest\auth('/private/auth');
new \mcc\rest\data\pri('/private/data');


// run slim app
$app->run();

<?php

// database
\mcc\obj\sql::init('','','');

// twitter
$twitterSettings = array(
    'oauth_access_token' => '',
    'oauth_access_token_secret' => '',
    'consumer_key' => '',
    'consumer_secret' => ''
);
\mcc\obj\twitter\twitter::config($twitterSettings);

// instagram
\mcc\obj\instagram\instagram::setAccessToken('');

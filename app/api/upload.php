<?php

require __DIR__.'/../../vendor/autoload.php';
use Websafe\Blueimp\JqueryFileUploadHandler;



function get_full_url()
{
    $https = !empty($_SERVER['HTTPS']) && strcasecmp($_SERVER['HTTPS'], 'on') === 0 ||
        !empty($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
        strcasecmp($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') === 0;
    return
        ($https ? 'https://' : 'http://').
        (!empty($_SERVER['REMOTE_USER']) ? $_SERVER['REMOTE_USER'].'@' : '').
        (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : ($_SERVER['SERVER_NAME'].
            ($https && $_SERVER['SERVER_PORT'] === 443 ||
            $_SERVER['SERVER_PORT'] === 80 ? '' : ':'.$_SERVER['SERVER_PORT']))).
        substr($_SERVER['SCRIPT_NAME'], 0, strrpos($_SERVER['SCRIPT_NAME'], '/'));
}


$uh = new JqueryFileUploadHandler([
    'upload_dir' => __DIR__.'/../uploads/',
    'upload_url' => get_full_url() . '/uploads/'
]);
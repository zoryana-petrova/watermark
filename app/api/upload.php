<?php
//
require '../vendor/autoload.php';
//
use Websafe\Blueimp\JqueryFileUploadHandler;
//
$uploadPath = array (
                'script_url' => $this->get_full_url().'/'.basename($this->get_server_var('SCRIPT_NAME')),
                'upload_dir' => dirname($this->get_server_var('SCRIPT_FILENAME')).'/uploads/',
                'upload_url' => $this->get_full_url().'/uploads/'
                );
$uh = new JqueryFileUploadHandler($uploadPath);
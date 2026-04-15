<?php

if (! file_exists(__DIR__ . '/../vendor/autoload.php')) {
    throw new RuntimeException('Please run "composer install" to load dependencies.');
}

require __DIR__ . '/../vendor/autoload.php';

if (file_exists(__DIR__ . '/../.env.testing')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../', '.env.testing');
    $dotenv->safeLoad();
}

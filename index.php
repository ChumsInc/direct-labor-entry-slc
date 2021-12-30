<?php
/**
 * @package Chums
 * @subpackage Routings
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2012, steve
 */

require_once "autoload.inc.php";
include_once "access.inc.php";
enable_error_reporting(true);

$bodyPath = "/apps/direct-labor-entry";
$title = "Direct Labor Entry";
$description = "Direct Labor Entry";
$ui = new WebUI($bodyPath, $title, $description, true, 5);
$ui->bodyClassName = 'container-fluid';
$ui->release = iUI::RELEASE_BETA;
$ui->version = "2014.05.14";
// $ui->saveFormPath = "/reports/rep/accounts/body.ajax.inc.php";

$ui->addManifest("./public/js/manifest.json");
$ui->AddCSS("./public/styles.css", false, true);
$ui->Send();

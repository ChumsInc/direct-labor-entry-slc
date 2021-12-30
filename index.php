<?php
/**
 * @package Chums
 * @subpackage Routings
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2012, steve
 */

require_once "autoload.inc.php";
include_once "access.inc.php";

$bodyPath = "/apps/direct-labor-entry-slc";
$title = "SLC Direct Labor Entry";
$ui = new WebUI($bodyPath, $title, '', true, 5);
$ui->bodyClassName = 'container-fluid';

$ui->addManifest("./public/js/manifest.json");
$ui->AddCSS("./public/styles.css", false, true);
$ui->Send();

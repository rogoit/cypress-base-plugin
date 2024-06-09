"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="cypress" />
// @ts-nocheck
const tt_accessibility_1 = require("./commands/tt-accessibility");
const tt_cookie_all_accept_1 = require("./commands/tt-cookie-all-accept");
const tt_detect_http_1 = require("./commands/tt-detect-http");
const tt_element_exists_1 = require("./commands/tt-element-exists");
const tt_every_internal_link_is_loading_1 = require("./commands/tt-every-internal-link-is-loading");
const tt_every_internal_link_status_ok_1 = require("./commands/tt-every-internal-link-status-ok");
const tt_get_internal_links_1 = require("./commands/tt-get-internal-links");
const tt_invalid_path_404_1 = require("./commands/tt-invalid-path-404");
const tt_only_one_h1_1 = require("./commands/tt-only-one-h1");
const tt_page_loaded_1 = require("./commands/tt-page-loaded");
const tt_run_testify_base_tests_1 = require("./commands/tt-run-testify-base-tests");
const tt_setup_console_error_listener_1 = require("./commands/tt-setup-console-error-listener");
const tt_threshold_1 = require("./commands/tt-threshold");
const tt_validate_all_images_response_status_ok_1 = require("./commands/tt-validate-all-images-response-status-ok");
const tt_validate_imprint_clickable_1 = require("./commands/tt-validate-imprint-clickable");
const tt_validate_language_tag_1 = require("./commands/tt-validate-language-tag");
const tt_validate_no_google_services_1 = require("./commands/tt-validate-no-google-services");
const tt_validate_page_content_1 = require("./commands/tt-validate-page-content");
const tt_validate_subpages_and_images_1 = require("./commands/tt-validate-subpages-and-images");
Cypress.Commands.add('ttAccessibility', tt_accessibility_1.ttAccessibility);
Cypress.Commands.add('ttCookieAllAcceptClick', tt_cookie_all_accept_1.ttCookieAllAcceptClick);
Cypress.Commands.add('ttDetectHttp', tt_detect_http_1.ttDetectHttp);
Cypress.Commands.add('ttElementExists', tt_element_exists_1.ttElementExists);
Cypress.Commands.add('ttEveryInternalLinkIsLoading', tt_every_internal_link_is_loading_1.ttEveryInternalLinkIsLoading);
Cypress.Commands.add('ttEveryInternalLinkStatusOk', tt_every_internal_link_status_ok_1.ttEveryInternalLinkStatusOk);
Cypress.Commands.add('ttGetInternalLinks', tt_get_internal_links_1.ttGetInternalLinks);
Cypress.Commands.add('ttInvalidPath404', tt_invalid_path_404_1.ttInvalidPath404);
Cypress.Commands.add('ttOnlyOneH1', tt_only_one_h1_1.ttOnlyOneH1);
Cypress.Commands.add('ttPageLoaded', tt_page_loaded_1.ttPageLoaded);
Cypress.Commands.add('ttRunTestifyBaseTests', tt_run_testify_base_tests_1.ttRunTestifyBaseTests);
Cypress.Commands.add('ttSetupConsoleErrorListener', tt_setup_console_error_listener_1.ttSetupConsoleErrorListener);
Cypress.Commands.add('ttThreshold', tt_threshold_1.ttThreshold);
Cypress.Commands.add('ttValidateAllImagesResponseStatusOk', tt_validate_all_images_response_status_ok_1.ttValidateAllImagesResponseStatusOk);
Cypress.Commands.add('ttValidateImprintClickable', tt_validate_imprint_clickable_1.ttValidateImprintClickable);
Cypress.Commands.add('ttValidateLanguageTag', tt_validate_language_tag_1.ttValidateLanguageTag);
Cypress.Commands.add('ttValidateNoGoogleServices', tt_validate_no_google_services_1.ttValidateNoGoogleServices);
Cypress.Commands.add('ttValidatePageContent', tt_validate_page_content_1.ttValidatePageContent);
Cypress.Commands.add('ttValidateSubpagesAndImages', tt_validate_subpages_and_images_1.ttValidateSubpagesAndImages);

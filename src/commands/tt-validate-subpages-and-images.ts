import { ttGetInternalLinks } from './tt-get-internal-links'
import { ttValidateAllImagesResponseStatusOk } from './tt-validate-all-images-response-status-ok'
import {
  addCredentialsToUrl,
  extractAuth
} from './../utils/extractAuth'

/**
 * Rewrites internal image sources (src and srcset candidates) to include
 * the baseUrl basic auth credentials. Required when the site is protected
 * by htaccess basic auth, because browser image requests do not inherit
 * the credentials from the page URL. No-op when the baseUrl has no
 * credentials.
 */
const rewriteInternalImageSources = (): void => {
  cy.get('body', { log: false }).then(($body) => {
    const baseUrl = Cypress.config('baseUrl') as string | undefined
    if (!baseUrl || !extractAuth(baseUrl)) return

    $body.find('img[src], img[srcset]').each((_, element) => {
      const img = element as unknown as HTMLImageElement

      if (img.getAttribute('src')) {
        const rewritten = addCredentialsToUrl(img.src, baseUrl)
        if (rewritten !== img.src) {
          img.src = rewritten
        }
      }

      const srcset = img.getAttribute('srcset')
      if (srcset) {
        const rewritten = srcset
          .split(',')
          .map((candidate) => {
            const parts = candidate.trim().split(/\s+/)
            if (parts[0] === '') return null
            return [addCredentialsToUrl(parts[0], baseUrl), ...parts.slice(1)].join(' ')
          })
          .filter((candidate): candidate is string => candidate !== null)
          .join(', ')

        if (rewritten !== srcset) {
          img.srcset = rewritten
        }
      }
    })
  })
}

const scrollTillLoaded = (loadTimeout: number): void => {
  cy.log('Scrolling page to trigger lazy loading - NCA TESTIFY')

  const scrollToBottom = (): void => {
    cy.window({ log: false }).then((win) => {
      const nextScroll = win.scrollY + win.innerHeight
      win.scrollTo(0, nextScroll)

      if (nextScroll < win.document.documentElement.scrollHeight) {
        // eslint-disable-next-line cypress/no-unnecessary-waiting -- gives lazy loading images time to trigger while scrolling
        cy.wait(300, { log: false }).then(scrollToBottom)
        return
      }

      cy.log('Page bottom reached, waiting for lazy loading images')

      rewriteInternalImageSources()

      cy.get('img[src], img[srcset]', { timeout: loadTimeout }).should(
        ($imgs) => {
          $imgs.each((_, element) => {
            const img = element as HTMLImageElement
            if (!img.complete || img.naturalWidth === 0) {
              throw new Error(
                `Image not loaded: ${
                  img.currentSrc ||
                  img.getAttribute('src') ||
                  img.getAttribute('srcset') ||
                  'unknown'
                }`
              )
            }
          })
        }
      )
    })
  }

  scrollToBottom()
}

export const ttValidateSubpagesAndImages = (
  limit: number = 20,
  linkSelector?: string,
  loadTimeout: number = 10000
) => {
  cy.log('ttValidateSubpagesAndImages - NCA TESTIFY')
  return ttGetInternalLinks(linkSelector).then((urls: string[]) => {
    urls.slice(0, limit).forEach((url) => {
      if (!url.includes('.pdf')) {
        cy.visit(url)
        scrollTillLoaded(loadTimeout)
        ttValidateAllImagesResponseStatusOk(url)
      } else {
        cy.log('PDF detected' + url)
      }
      cy.clearAllLocalStorage()
    })
    return null
  })
}

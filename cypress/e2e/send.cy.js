/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

// added some custom command to ease the code
Cypress.Commands.add('got', (testId) => {
    return cy.get(`[data-testid="${testId}"]`)
})

it("sends the message", () => {
    // initialize some fake data to load
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const phone = faker.phone.number();
    const subject = faker.word.noun(5); 
    const messagebody = faker.lorem.paragraph(1);

    // enter data in the form
    cy.visit("/")
    cy.get(".row.contact form").within(() => {
        cy.got('ContactName').type(name)
        cy.got('ContactEmail').type(email)
        cy.got('ContactPhone').type(phone)
        cy.got('ContactSubject').type(subject)
        cy.got('ContactDescription').type(messagebody)
        cy.get('#submitContact').click()
    })
    
    // admin login
    cy.on('uncaught:exception', () => false)
    cy.visit('/#/admin')
    cy.get('[data-testid="username"]').type('admin')
    cy.get('[data-testid="password"]').type(('password'), {
        log: false,
    })
    cy.get('[data-testid="submit"]').click();

    cy.contains('.navbar', 'B&B Booking Management')
        .should('be.visible')
        .find('a[href="#/admin/messages"]')
        .click()
    cy.location('hash').should('equal', '#/admin/messages')

    //check the message
    cy.get('.row.detail')
        .should('have.length.greaterThan', 0)
        .contains('.row', subject)
        .should('have.class', 'read-false')
        .click()
    cy.contains('.message-modal', subject)
        .should('be.visible')
        .and('include.text', name)
        .and('include.text', phone)
        .and('include.text', email)
        .and('include.text', subject)
        .and('include.text', messagebody)
        .contains('button', 'Close')
        .click()
    cy.contains('.message-modal', subject).should('not.exist')
    cy.contains('.row.detail', subject)
        .should('have.class', 'read-true')
        .and('not.have.class', 'read-false')
});
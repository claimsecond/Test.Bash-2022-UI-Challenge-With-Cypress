/// <reference types="cypress" />
import { faker } from '@faker-js/faker';


it("sends the message",() => {
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const phone = faker.phone.number();
    const subject = faker.word.noun(5); 
    const messagebody = faker.lorem.paragraph(2);

    cy.visit("/")
    cy.get(".row.contact form").within(() => {
        cy.get('[data-testid="ContactName"]').type(name)
        cy.get('[data-testid="ContactEmail"]').type(email)
        cy.get('[data-testid="ContactPhone"]').type(phone)
        cy.get('[data-testid="ContactSubject"]').type(subject)
        cy.get('[data-testid="ContactDescription"]').type(messagebody)
        cy.get('#submitContact').click()
    })
    
    cy.log('**checking messages**')
    
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
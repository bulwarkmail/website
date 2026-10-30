---
title: Booking and parcel cards
description: Cards for flights, hotels, tickets, parcels and orders, read from the mail itself.
order: 3
edition: both
---

# Booking and parcel cards

Many airlines, hotels, ticket shops, carriers and online shops put machine-readable data into their mail, the same schema.org markup Gmail and Outlook read. When a message carries it, Bulwark shows a short card above the message with the facts that matter and the one thing you usually want to do next.

## What the cards show

| Mail | Card |
|---|---|
| Flight, train, bus | Route, departure and arrival in the local time of each place, carrier and number, passengers, seats, booking reference with a copy button, check-in link when the mail has one |
| Hotel | Name, address, check-in and check-out days and times, number of nights, booking reference |
| Rental car | Company, pick-up and drop-off place and time, car, booking reference |
| Event | Name, date and time, venue, ticket numbers, ticket link |
| Restaurant | Name, date and time, address, party size |
| Parcel | Carrier, tracking number with a copy button, expected delivery, items, Track link |
| Order | Shop, order number, status (processing, shipped, delivered, ...), items, total, link to the order |

A flight with several passengers and legs is one card, and an order mail that also announces the shipment is one card too. Links show the website they lead to before you click them. Product pictures follow your external content setting, so they stay hidden until you allow external content for the message or trust the sender.

Apple Wallet passes attached to a mail (`.pkpass` boarding passes and event tickets) give the same card when the mail itself carries no booking markup. When it does, the markup wins and the pass isn't opened.

## Adding to your calendar

Flight, train, bus, hotel, rental car, event and restaurant cards have an **Add to calendar** button. Nothing is added on its own: you pick the calendar the same way as for a meeting invitation.

- Flights get one event per leg, starting in the departure airport's time zone and ending in the arrival airport's, so "departs 20:15" stays 20:15 local time wherever you are when you look at it.
- A hotel stay is an all-day event from the check-in day through the check-out day, or a timed event when the mail gives check-in and check-out times. Hotel and rental-car events are marked as free time, so they don't block your schedule.
- Once added, the card says **In your calendar**. When a later mail from the same sender changes the booking (a new departure time, say), the card offers **Update in calendar**. When the booking is cancelled, it offers **Remove from calendar**.

## When no card appears

A card looks official and a calendar entry outlives the mail, so Bulwark leaves the card out whenever it has doubts:

- **The sender isn't verified.** The receiving mail server must have confirmed with SPF or DKIM that the mail really comes from the domain in the From address. Mail that fails the check, that nobody checked, or that a colleague handed in on your own server gets no card.
- **It was forwarded.** A forwarded booking was checked for the person who forwarded it, not for the airline or shop. Mail with "Fwd:" in the subject, a forwarded-message block in the text, or a From address at a personal mail provider gets no card. Mail inside an attached message gets none either.
- **The data doesn't hold together.** Arrival before departure, a flight over 20 hours, a check-out before the check-in, missing times, a booking years away from the date of the mail, or times that don't match the airport's time zone: the card is left out rather than shown wrong. One bad leg drops the whole booking.
- **The mail has no markup.** Most European train operators and many hotels still send none. Bulwark doesn't guess from the text.

## Privacy

Everything happens in your browser, on the mail you opened. Bulwark doesn't contact the airline, the carrier or any tracking service, and the booking data isn't sent anywhere. The time zone table for airports is part of Bulwark and loads from your own server.

<div class="lite-callout">Bulwark Lite shows the same cards; they need no server of their own.</div>

## For administrators

The cards are on by default. **Admin → Policy → Booking and Parcel Cards** turns them off for everyone, for example if mail content shouldn't turn into calendar entries in your organisation. The calendar button also follows the Calendar switch on the same page.

The sender check relies on the Authentication-Results header your mail server writes on receipt. Bulwark only trusts that header when a Received header sits above it, so a header a local user wrote into their own message doesn't count.

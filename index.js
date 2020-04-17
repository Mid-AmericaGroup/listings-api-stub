const express = require('express');
const bodyParser = require('body-parser');

const Chance = require('chance');

const chance = new Chance();

const app = express()

app.use(bodyParser.json());

const port = 3000

const listings = [];

const getListingByListingId = (listingId) => listings.find((currentListing) => currentListing.id.toString() === listingId)
const getListingByMlsNumber = (mlsNumber) => listings.find((currentListing) => currentListing.mls_number === mlsNumber)

// BEGIN LISTING ENDPOINTS
app.get('/api/v1/listings', (request, response) => {
    console.log({listings});
    const { mls_number } = request.query;

    const listing = getListingByMlsNumber(mls_number);

    if (!listing) {
        response.sendStatus(404);
        return;
    }

    response.json({
        id: listing.id,
        mls_number
    });
});

app.get('/api/v1/listings/:listing_id', (request, response) => {
    const { listing_id } = request.params;

    const listing = getListingByListingId(listing_id);

    if (!listing) {
        response.json(null);

        return;
    }

    response.json({
        id: listing.id,
        mls_number: listing.mls_number,
        virtual_tour_url: listing.virtual_tour_url,
        youtube_url: listing.youtube_url
    });
});

app.get('/api/v2/listings/:listing_id', (request, response, updateFunc) => {
    const { listing_id } = request.params;

    const listing = getListingByListingId(listing_id);

    if (!listing) {
        response.sendStatus(404);
        return;
    }

    response.json({
        id: listing.id,
        mls_number: listing.mls_number,
        virtual_tour_url: listing.virtual_tour_url,
        youtube_url: listing.youtube_url
    });
});

const updateListing = (request, response, updateFunc) => {
    const { listing_id } = request.params;

    const listing = getListingByListingId(listing_id);

    if (!listing) {
        response.sendStatus(404);
        return;
    }

    const updatedListing = updateFunc(listing, request.body);

    listings[listings.indexOf(listing)] = updatedListing

    response.sendStatus(204)
}

app.put('/api/v1/listings/:listing_id', (request, response) => updateListing(request, response, (listing, body) => {
    const updates = {
        virtual_tour_url: body.virtual_tour_url,
        youtube_url: body.youtube_url
    };

    return {
        ...listing,
        ...updates
    };
}));

app.put('/api/v2/listings/:listing_id', (request, response) => updateListing(request, response, (listing, body) => {
    const updates = {
        virtual_tour_url: body.virtual_tour_url || listing.virtual_tour_url,
        youtube_url: body.youtube_url || listing.youtube_url
    };

    return {
        ...listing,
        ...updates
    };
}))

app.post('/api/v1/listings', (request, response) => {
    const listing = {
        id: chance.natural(),
        mls_number: chance.natural().toString(),
        listing_photos: [],
        virtual_tour_url: null,
        youtube_url: null,
        ...request.body
    };

    listings.push(listing)

    response.json({
        id: listing.id,
        mls_number: listing.mls_number
    });
});

// END LISTING ENDPOINTS
// BEGIN LISTING PHOTO ENDPOINTS

const createListingPhoto = (request, response) => {
    const listing = getListingByListingId(request.params.listing_id);

    if (!listing) {
        response.sendStatus(422);
        return;
    }

    const listing_photo = {
        id: chance.natural(),
        position: chance.natural({ max: 50 })
    }

    listing.listing_photos.push(listing_photo);

    response.status(201).json(listing_photo);
};

app.post('/api/v1/listings/:listing_id/listing_photos', (request, response) => createListingPhoto(request, response));

app.post('/api/v2/listings/:listing_id/listing_photos', (request, response) => createListingPhoto(request, response));

const getListingPhotos = (request, response) => {
    const listing = getListingByListingId(request.params.listing_id);

    if (!listing) {
        response.sendStatus(404);
        return;
    }

    response.json(listing.listing_photos);
}

app.get('/api/v1/listings/:listing_id/listing_photos', (request, response) => getListingPhotos(request, response));

app.get('/api/v2/listings/:listing_id/listing_photos', (request, response) => getListingPhotos(request, response));

app.put('/api/v2/listing_photos/:id', (request, response) => {
    const listingPhoto = listings.reduce(
        (accumulator, listing) => [...accumulator, ...listing.listing_photos],
        []
    ).find((photo) => photo.id.toString() === request.params.id);

    if (!listingPhoto) {
        response.sendStatus(404);
    } else {
        response.sendStatus(204);
    }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
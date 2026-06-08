import { defineHandler, type H3Event } from 'nitro';

export default defineHandler(async (event: H3Event) => {
    const body = await event.req.json();

    // Here you can process the body and perform any necessary actions, such as saving to a database

    return { status: 201, message: 'Ingredient created successfully!', data: body };
});
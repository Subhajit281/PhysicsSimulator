#include "Friction.h"
#include <cmath>
#include <iostream>
#include <algorithm> // needed for clamp

float Friction::rad(float deg)
{
    return deg * 3.1415926535f / 180.f;
}

sf::VertexArray Friction::makeArrow(sf::Vector2f start, sf::Vector2f dir, sf::Color color)
{
    sf::VertexArray arrow(sf::Lines, 2);

    arrow[0].position = start;
    arrow[1].position = start + dir;

    arrow[0].color = color;
    arrow[1].color = color;

    return arrow;
}

void Friction::run()
{
    const int WIDTH = 1400;
    const int HEIGHT = 900;

    sf::RenderWindow window(sf::VideoMode(WIDTH, HEIGHT), "Ramp Physics Simulator");
    window.setFramerateLimit(120);

    float angle = 25.f;
    float mass = 5.f;
    float mu = 0.3f;

    const float g = 9.81f;

    float velocity = 0;
    float position = 0;

    bool paused = false;

    sf::RectangleShape ramp(sf::Vector2f(6000, 12));
    ramp.setOrigin(3000, 6);
    ramp.setPosition(WIDTH / 2, 650);
    ramp.setFillColor(sf::Color(200, 200, 200));

    sf::RectangleShape block(sf::Vector2f(70, 70));
    block.setOrigin(35, 35);
    block.setFillColor(sf::Color::Red);

    sf::Font font;
    font.loadFromFile("C:/Windows/Fonts/arial.ttf");

    sf::Text info;
    info.setFont(font);
    info.setCharacterSize(18);
    info.setPosition(20, 20);

    sf::Clock clock;

    while (window.isOpen())
    {
        sf::Event event;

        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();

            if (event.type == sf::Event::KeyPressed)
            {
                if (event.key.code == sf::Keyboard::Space)
                    paused = !paused;
            }
        }

        float dt = clock.restart().asSeconds();

        // -------- INPUT --------
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::A))
            angle += 40 * dt;

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::D))
            angle -= 40 * dt;

        // SAFE CLAMP (-90 to +90)
        angle = std::clamp(angle, -90.f, 90.f);

        float r = rad(angle);

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::W))
            mu += 0.3f * dt;

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::S))
            mu -= 0.3f * dt;

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Q))
            mass += 2 * dt;

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::E))
            mass -= 2 * dt;

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::R))
        {
            velocity = 0;
            position = 0;
        }

        // -------- SAFETY LIMITS --------
        mass = std::max(0.5f, mass);
        mu = std::max(0.0f, mu);

        // -------- FORCES --------
        float appliedForce = 0;

        if (sf::Mouse::isButtonPressed(sf::Mouse::Left))
            appliedForce = 50;

        if (sf::Mouse::isButtonPressed(sf::Mouse::Right))
            appliedForce = -50;

        float gravityParallel = -mass * g * sin(r);
        float normal = mass * g * cos(r);

        float friction = mu * normal;

        if (velocity > 0)
            friction = -friction;
        else if (velocity < 0)
            friction = friction;

        float netForce = gravityParallel + friction + appliedForce;
        float acceleration = netForce / mass;

        // -------- MOTION --------
        if (!paused)
        {
            velocity += acceleration * dt;
            position += velocity * 120 * dt;
        }

        // -------- RENDER --------
        ramp.setRotation(-angle);

        float x = WIDTH / 2 + cos(r) * position;
        float y = 650 - sin(r) * position;

        block.setPosition(x, y);

        sf::Vector2f p = block.getPosition();

        auto gravityArrow = makeArrow(p, { 0,120 }, sf::Color::Yellow);
        auto normalArrow = makeArrow(p, { -sin(r) * 120,-cos(r) * 120 }, sf::Color::Green);
        auto frictionArrow = makeArrow(p, { -cos(r) * 80,sin(r) * 80 }, sf::Color::Blue);
        auto appliedArrow = makeArrow(p, { cos(r) * appliedForce,-sin(r) * appliedForce }, sf::Color::Red);

        info.setString(
            "RAMP PHYSICS LAB\n\n"
            "Angle: " + std::to_string((int)angle) +
            "\nMass: " + std::to_string(mass) +
            "\nFriction: " + std::to_string(mu) +
            "\nVelocity: " + std::to_string(velocity) +
            "\nAcceleration: " + std::to_string(acceleration) +
            "\n\nsin(theta): " + std::to_string(sin(r)) +
            "\ncos(theta): " + std::to_string(cos(r)) +
            "\n\nCONTROLS\n"
            "Left Mouse  : Pull Up Ramp\n"
            "Right Mouse : Push Down Ramp\n"
            "A / D       : Change Ramp Angle\n"
            "W / S       : Change Friction\n"
            "Q / E       : Change Mass\n"
            "R           : Reset\n"
            "SPACE       : Pause"
        );

        window.clear(sf::Color(15, 18, 30));

        window.draw(ramp);
        window.draw(block);

        window.draw(gravityArrow);
        window.draw(normalArrow);
        window.draw(frictionArrow);
        window.draw(appliedArrow);

        window.draw(info);

        window.display();
    }
}
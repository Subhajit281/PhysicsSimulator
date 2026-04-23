#include "Oscillation.h"
#include <SFML/Graphics.hpp>
#include <cmath>
#include <sstream>

using namespace std;

float sign(float x)
{
    if (x > 0) return 1.0f;
    if (x < 0) return -1.0f;
    return 0.0f;
}

void Oscillation::run()
{
    const int WIDTH = 1400;
    const int HEIGHT = 700;

    sf::RenderWindow window(sf::VideoMode(WIDTH, HEIGHT), "Ultimate Spring Simulator");
    window.setFramerateLimit(60);

    // ---------------- PHYSICS ----------------
    float k = 4.0f;
    float mass = 2.0f;

    //  DAMPING RATIO (USER CONTROLLED)
    float zeta = 0.2f;
    float damping = zeta * 2.0f * sqrt(k * mass);

    float friction = 0.01f;

    float restLength = 400.0f;
    float minLength = 80.0f;

    float displacement = restLength;
    float velocity = 0.0f;

    float wallX = 120.0f;

    bool dragging = false;

    // ---------------- OBJECTS ----------------
    sf::RectangleShape block(sf::Vector2f(90, 70));
    block.setFillColor(sf::Color::Green);
    block.setOrigin(45, 35);

    sf::RectangleShape wall(sf::Vector2f(25, 140));
    wall.setFillColor(sf::Color::Red);
    wall.setPosition(wallX - 25, HEIGHT / 2 - 70);

    sf::RectangleShape ground(sf::Vector2f(WIDTH, 5));
    ground.setPosition(0, HEIGHT / 2 + 40);
    ground.setFillColor(sf::Color::White);

    sf::VertexArray spring(sf::LineStrip);

    // ---------------- FONT ----------------
    sf::Font font;
    font.loadFromFile("C:/Windows/Fonts/arial.ttf");

    sf::Text info;
    info.setFont(font);
    info.setCharacterSize(18);
    info.setFillColor(sf::Color::White);
    info.setPosition(10, 10);

    sf::Clock clock;

    while (window.isOpen())
    {
        float dt = clock.restart().asSeconds();

        // ---------------- EVENTS ----------------
        sf::Event event;
        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();

            if (event.type == sf::Event::MouseButtonPressed)
                dragging = true;

            if (event.type == sf::Event::MouseButtonReleased)
                dragging = false;

            if (event.type == sf::Event::KeyPressed)
            {
                if (event.key.code == sf::Keyboard::W) k += 0.5f;
                if (event.key.code == sf::Keyboard::S) k = max(0.5f, k - 0.5f);

                if (event.key.code == sf::Keyboard::Q) mass += 0.5f;
                if (event.key.code == sf::Keyboard::A) mass = max(0.5f, mass - 0.5f);

                if (event.key.code == sf::Keyboard::E) friction += 0.01f;
                if (event.key.code == sf::Keyboard::D) friction = max(0.0f, friction - 0.01f);

                // DAMPING CONTROL
                if (event.key.code == sf::Keyboard::Z)
                    zeta += 0.1f;

                if (event.key.code == sf::Keyboard::X)
                    zeta = max(0.0f, zeta - 0.1f);

                // RESET
                if (event.key.code == sf::Keyboard::R)
                {
                    displacement = restLength;
                    velocity = 0.0f;
                }
            }
        }

        //  UPDATE DAMPING EVERY FRAME
        damping = zeta * 2.0f * sqrt(k * mass);

        // ---------------- DRAG ----------------
        if (dragging)
        {
            float mouseX = sf::Mouse::getPosition(window).x;

            float minX = wallX + minLength;
            if (mouseX < minX)
                mouseX = minX;

            displacement = mouseX - wallX;
            velocity = 0.0f;
        }
        else
        {
            float extension = displacement - restLength;

            float springForce = -k * extension;
            float dampingForce = -damping * velocity;

            float netForce = springForce + dampingForce;

            float staticFriction = friction * 2.0f;

            if (fabs(velocity) < 0.01f)
            {
                if (fabs(netForce) < staticFriction)
                {
                    velocity = 0.0f;
                    netForce = 0.0f;
                }
                else
                {
                    netForce -= staticFriction * sign(netForce);
                }
            }
            else
            {
                netForce -= friction * sign(velocity);
            }

            float acceleration = netForce / mass;

            velocity += acceleration * dt;
            displacement += velocity * dt;

            if (fabs(velocity) < 0.01f && fabs(displacement - restLength) < 0.5f)
            {
                velocity = 0.0f;
                displacement = restLength;
            }

            if (displacement < minLength)
            {
                displacement = minLength;
                if (velocity < 0) velocity = 0;
            }
        }

        float blockX = wallX + displacement;
        block.setPosition(blockX, HEIGHT / 2);

        // ---------------- SPRING ----------------
        spring.clear();

        int coils = 50;
        float amplitude = 12.0f;

        for (int i = 0; i <= coils; i++)
        {
            float t = (float)i / coils;

            float sx = wallX + t * displacement;
            float sy = HEIGHT / 2 + sin(t * 20 * 3.14159f) * amplitude;

            spring.append(sf::Vertex(sf::Vector2f(sx, sy), sf::Color::White));
        }

        // ---------------- UI ----------------
        stringstream ss;
        ss << "ULTIMATE SPRING SIMULATOR\n\n";
        ss << "Mass: " << mass << "\n";
        ss << "k: " << k << "\n";
        ss << "Friction: " << friction << "\n";
        ss << "Damping Ratio (zeta): " << zeta << "\n\n";
        ss << "Velocity: " << velocity << "\n";
        ss << "Extension: " << (displacement - restLength) << "\n\n";
        ss << "Controls:\n";
        ss << "Z/X = Change damping\n";
        ss << "Mouse Drag = Apply force\n";
        ss << "W/S = stiffness\n";
        ss << "Q/A = mass\n";
        ss << "E/D = friction\n";
        ss << "R = Reset";

        info.setString(ss.str());

        window.clear(sf::Color::Black);

        window.draw(ground);
        window.draw(wall);
        window.draw(spring);
        window.draw(block);
        window.draw(info);

        window.display();
    }
}
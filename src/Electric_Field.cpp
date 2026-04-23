#include "Electric_Field.h"
#include <cmath>
#include <iostream>
#include <algorithm>

const float K = 9000.0f;

float ElectricField::length(sf::Vector2f v)
{
    return std::sqrt(v.x * v.x + v.y * v.y);
}

sf::Vector2f ElectricField::normalize(sf::Vector2f v)
{
    float l = length(v);

    if (l == 0)
        return sf::Vector2f(0, 0);

    return v / l;
}

void ElectricField::run()
{
    sf::RenderWindow window(sf::VideoMode(1400, 900), "Electric Field Laboratory");

    std::vector<Charge> charges;
    std::vector<Particle> particles;

    float particleCharge = 1.0f;
    float particleMass = 1.0f;

    bool paused = false;

    sf::Font font;
    font.loadFromFile("C:/Windows/Fonts/arial.ttf");

    sf::Text info;
    info.setFont(font);
    info.setCharacterSize(18);
    info.setPosition(20, 20);

    sf::RectangleShape particleBar;
    particleBar.setPosition(20, 120);
    particleBar.setSize(sf::Vector2f(0, 20));
    particleBar.setFillColor(sf::Color(80, 200, 120));

    sf::Clock clock;

    while (window.isOpen())
    {
        sf::Event event;

        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();

            if (event.type == sf::Event::MouseButtonPressed)
            {
                sf::Vector2f m = (sf::Vector2f)sf::Mouse::getPosition(window);

                if (event.mouseButton.button == sf::Mouse::Left)
                    charges.push_back({ m,500 });

                if (event.mouseButton.button == sf::Mouse::Right)
                    charges.push_back({ m,-500 });
            }

            if (event.type == sf::Event::KeyPressed)
            {
                if (event.key.code == sf::Keyboard::T)
                {
                    Particle p;
                    p.pos = sf::Vector2f(700, 450);
                    p.vel = sf::Vector2f(0, 0);

                    particles.push_back(p);
                }

                if (event.key.code == sf::Keyboard::C)
                    charges.clear();

                if (event.key.code == sf::Keyboard::X)
                    particles.clear();

                if (event.key.code == sf::Keyboard::P)
                    paused = !paused;
            }
        }

        float dt = clock.restart().asSeconds();

        if (!paused)
        {
            for (auto& p : particles)
            {
                sf::Vector2f netForce(0, 0);

                for (auto& c : charges)
                {
                    sf::Vector2f r = p.pos - c.pos;

                    float dist = length(r);

                    if (dist < 20)
                        dist = 20;

                    sf::Vector2f dir = normalize(r);

                    float forceMag = K * particleCharge * c.q / (dist * dist);

                    netForce += dir * forceMag;
                }

                sf::Vector2f acc = netForce / particleMass;

                p.vel += acc * dt;

                p.pos += p.vel * dt;
            }
        }

        window.clear(sf::Color(20, 20, 30));

        for (auto& c : charges)
        {
            sf::CircleShape shape(12);
            shape.setOrigin(12, 12);
            shape.setPosition(c.pos);

            if (c.q > 0)
                shape.setFillColor(sf::Color::Red);
            else
                shape.setFillColor(sf::Color::Blue);

            window.draw(shape);
        }

        for (auto& p : particles)
        {
            sf::CircleShape particle(6);
            particle.setOrigin(6, 6);
            particle.setPosition(p.pos);
            particle.setFillColor(sf::Color::White);

            window.draw(particle);
        }

        float barWidth = std::min((float)particles.size() * 10.f, 300.f);

        particleBar.setSize(sf::Vector2f(barWidth, 20));

        window.draw(particleBar);

        info.setString(
            "ELECTRIC FIELD LAB\n\n"
            "Charges: " + std::to_string(charges.size()) +
            "\nParticles: " + std::to_string(particles.size()) +
            "\n\nControls\n"
            "T : Spawn Particle\n"
            "X : Clear Particles\n"
            "Left Click : Positive Charge\n"
            "Right Click : Negative Charge\n"
            "C : Clear Charges\n"
            "P : Pause"
        );

        window.draw(info);

        window.display();
    }
}
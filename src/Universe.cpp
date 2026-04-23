#include "Universe.h"
#include <cmath>
#include <cstdlib>

float Universe::vecLength(sf::Vector2f v)
{
    return std::sqrt(v.x * v.x + v.y * v.y);
}

void Universe::run()
{
    sf::RenderWindow window(sf::VideoMode(1200, 800), "Universe Creator Sandbox");

    std::vector<Body> bodies;
    std::vector<sf::Vertex> trails;

    bool paused = false;
    bool gravityEnabled = true;
    bool trailsEnabled = true;

    float planetSize = 6.f;

    const float G = 3000.f;

    bool dragging = false;
    sf::Vector2f dragStart;

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
                if (event.key.code == sf::Keyboard::Escape)
                    window.close();

                if (event.key.code == sf::Keyboard::Space)
                    paused = !paused;

                if (event.key.code == sf::Keyboard::C)
                    bodies.clear();

                if (event.key.code == sf::Keyboard::R)
                {
                    bodies.clear();
                    trails.clear();
                }

                if (event.key.code == sf::Keyboard::T)
                    trailsEnabled = !trailsEnabled;

                if (event.key.code == sf::Keyboard::G)
                    gravityEnabled = !gravityEnabled;

                if (event.key.code == sf::Keyboard::S)
                {
                    for (int i = 0; i < 5; i++)
                    {
                        Body b;

                        b.pos = { float(rand() % 1200), float(rand() % 800) };
                        b.vel = { float(rand() % 100 - 50) / 10.f, float(rand() % 100 - 50) / 10.f };

                        b.radius = 4 + rand() % 8;
                        b.mass = b.radius * 10;
                        b.blackhole = false;

                        b.shape = sf::CircleShape(b.radius);
                        b.shape.setOrigin(b.radius, b.radius);
                        b.shape.setFillColor(sf::Color(rand() % 255, rand() % 255, rand() % 255));
                        b.shape.setPosition(b.pos);

                        bodies.push_back(b);
                    }
                }

                if (event.key.code == sf::Keyboard::B)
                {
                    Body b;

                    b.pos = { 600.f, 400.f };
                    b.vel = { 0.f, 0.f };

                    b.radius = 18.f;
                    b.mass = 5000.f;
                    b.blackhole = true;

                    b.shape = sf::CircleShape(b.radius);
                    b.shape.setOrigin(b.radius, b.radius);
                    b.shape.setFillColor(sf::Color::Magenta);
                    b.shape.setPosition(b.pos);

                    bodies.push_back(b);
                }
            }

            if (event.type == sf::Event::MouseWheelScrolled)
            {
                planetSize += event.mouseWheelScroll.delta;

                if (planetSize < 2) planetSize = 2;
                if (planetSize > 25) planetSize = 25;
            }

            if (event.type == sf::Event::MouseButtonPressed)
            {
                if (event.mouseButton.button == sf::Mouse::Left)
                {
                    dragging = true;
                    dragStart = window.mapPixelToCoords(sf::Mouse::getPosition(window));
                }

                if (event.mouseButton.button == sf::Mouse::Right)
                {
                    sf::Vector2f pos = window.mapPixelToCoords(sf::Mouse::getPosition(window));

                    for (auto& b : bodies)
                    {
                        sf::Vector2f dir = b.pos - pos;
                        float dist = vecLength(dir) + 1.f;

                        b.vel += dir / dist * 200.f;
                    }
                }
            }

            if (event.type == sf::Event::MouseButtonReleased)
            {
                if (event.mouseButton.button == sf::Mouse::Left && dragging)
                {
                    dragging = false;

                    sf::Vector2f end = window.mapPixelToCoords(sf::Mouse::getPosition(window));

                    Body b;

                    b.pos = dragStart;
                    b.vel = (dragStart - end) * 0.4f;

                    b.radius = planetSize;
                    b.mass = planetSize * 10;
                    b.blackhole = false;

                    b.shape = sf::CircleShape(b.radius);
                    b.shape.setOrigin(b.radius, b.radius);
                    b.shape.setFillColor(sf::Color(rand() % 255, rand() % 255, rand() % 255));
                    b.shape.setPosition(b.pos);

                    bodies.push_back(b);
                }
            }
        }

        float dt = clock.restart().asSeconds();

        if (!paused && gravityEnabled)
        {
            for (size_t i = 0; i < bodies.size(); i++)
            {
                for (size_t j = 0; j < bodies.size(); j++)
                {
                    if (i == j) continue;

                    sf::Vector2f dir = bodies[j].pos - bodies[i].pos;
                    float dist = vecLength(dir) + 1.f;

                    bodies[i].vel += dir / dist * (G * bodies[j].mass / (dist * dist)) * dt;
                }
            }
        }

        for (auto& b : bodies)
        {
            b.pos += b.vel * dt;
            b.shape.setPosition(b.pos);

            trails.emplace_back(b.pos, sf::Color(200, 200, 255, 120));
        }

        if (trails.size() > 3000)
            trails.erase(trails.begin(), trails.begin() + 500);

        window.clear(sf::Color(5, 5, 25));

        if (!trails.empty())
            window.draw(&trails[0], trails.size(), sf::Points);

        for (auto& b : bodies)
            window.draw(b.shape);

        if (dragging)
        {
            sf::Vertex line[] =
            {
                sf::Vertex(dragStart, sf::Color::White),
                sf::Vertex(window.mapPixelToCoords(sf::Mouse::getPosition(window)), sf::Color::White)
            };

            window.draw(line, 2, sf::Lines);
        }

        window.display();
    }
}
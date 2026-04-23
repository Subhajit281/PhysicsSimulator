#include "Magnetic.h"
#include <cmath>

void Magnetic::run()
{
    sf::RenderWindow window(sf::VideoMode(1000, 700), "Magnetic Field Simulator");

    std::vector<Magnet> magnets;

    while (window.isOpen())
    {
        sf::Event event;

        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();

            if (event.type == sf::Event::MouseButtonPressed)
            {
                Magnet m;

                m.pos = sf::Vector2f(
                    (float)event.mouseButton.x,
                    (float)event.mouseButton.y
                );

                if (event.mouseButton.button == sf::Mouse::Left)
                    m.polarity = 1.0f;
                else
                    m.polarity = -1.0f;

                magnets.push_back(m);
            }
        }

        window.clear(sf::Color::Black);

        for (int x = 0; x < 1000; x += 40)
        {
            for (int y = 0; y < 700; y += 40)
            {
                sf::Vector2f field(0.f, 0.f);

                for (auto& m : magnets)
                {
                    sf::Vector2f r = sf::Vector2f((float)x, (float)y) - m.pos;

                    float dist = sqrt(r.x * r.x + r.y * r.y) + 1.0f;

                    float strength = m.polarity / (dist * dist);

                    field += (r / dist) * strength;
                }

                float len = sqrt(field.x * field.x + field.y * field.y);

                if (len > 0)
                    field /= len;

                sf::Vertex line[] =
                {
                    sf::Vertex(sf::Vector2f((float)x,(float)y), sf::Color::Green),
                    sf::Vertex(sf::Vector2f((float)x,(float)y) + field * 20.f, sf::Color::Green)
                };

                window.draw(line, 2, sf::Lines);
            }
        }

        for (auto& m : magnets)
        {
            sf::CircleShape c(8.f);

            c.setOrigin(8.f, 8.f);
            c.setPosition(m.pos);

            if (m.polarity > 0)
                c.setFillColor(sf::Color::Red);
            else
                c.setFillColor(sf::Color::Blue);

            window.draw(c);
        }

        window.display();
    }
}
#include "Pulley.h"
#include <SFML/Graphics.hpp>
#include <sstream>
#include <cmath>
#include <algorithm>

using namespace std;

string formatFloat(float v)
{
    stringstream ss;
    ss.precision(3);
    ss << fixed << v;
    return ss.str();
}

void drawArrow(sf::RenderWindow& window, sf::Vector2f start, sf::Vector2f end, sf::Color color)
{
    sf::Vertex line[] =
    {
        sf::Vertex(start,color),
        sf::Vertex(end,color)
    };

    window.draw(line, 2, sf::Lines);

    sf::CircleShape tip(5);
    tip.setOrigin(5, 5);
    tip.setPosition(end);
    tip.setFillColor(color);

    window.draw(tip);
}

void Pulley::run()
{
    const int WIDTH = 1300;
    const int HEIGHT = 850;

    float g = 9.81f;

    float m1 = 5.0f;
    float m2 = 3.0f;

    float pulleyRadius = 80;
    float pulleyMass = 8;

    float velocity = 0;
    float time = 0;
    float angle = 0;

    bool paused = false;
    bool showForces = true;

    // Rope adjusted to screen height
    const float ropeLength = 2 * (HEIGHT - 120);

    // START BOTH MASSES AT BOTTOM (VISIBLE)
    float y1 = HEIGHT - 120;
    float y2 = HEIGHT - 120;

    sf::RenderWindow window(sf::VideoMode(WIDTH, HEIGHT), "Advanced Atwood Machine");
    window.setFramerateLimit(120);

    sf::Font font;
    bool fontLoaded = false;

    if (font.loadFromFile("C:/Windows/Fonts/arial.ttf"))
        fontLoaded = true;

    sf::Text panel;

    if (fontLoaded)
    {
        panel.setFont(font);
        panel.setCharacterSize(20);
        panel.setFillColor(sf::Color::White);
    }

    sf::CircleShape pulley(pulleyRadius);
    pulley.setOrigin(pulleyRadius, pulleyRadius);
    pulley.setPosition(WIDTH / 2, 200);
    pulley.setFillColor(sf::Color::Transparent);
    pulley.setOutlineThickness(4);
    pulley.setOutlineColor(sf::Color::White);

    sf::RectangleShape mass1(sf::Vector2f(90, 90));
    sf::RectangleShape mass2(sf::Vector2f(90, 90));

    mass1.setFillColor(sf::Color::Green);
    mass2.setFillColor(sf::Color::Red);

    sf::Clock clock;

    while (window.isOpen())
    {
        float dt = clock.restart().asSeconds();

        sf::Event e;

        while (window.pollEvent(e))
        {
            if (e.type == sf::Event::Closed)
                window.close();

            if (e.type == sf::Event::KeyPressed)
            {
                if (e.key.code == sf::Keyboard::Space)
                    paused = !paused;

                if (e.key.code == sf::Keyboard::R)
                {
                    velocity = 0;
                    time = 0;

                    // RESET TO BOTTOM
                    y1 = HEIGHT - 120;
                    y2 = HEIGHT - 120;
                }

                if (e.key.code == sf::Keyboard::Q) m1++;
                if (e.key.code == sf::Keyboard::A) m1 = max(1.0f, m1 - 1);

                if (e.key.code == sf::Keyboard::W) m2++;
                if (e.key.code == sf::Keyboard::S) m2 = max(1.0f, m2 - 1);

                if (e.key.code == sf::Keyboard::G) g++;
                if (e.key.code == sf::Keyboard::H) g = max(1.0f, g - 1);

                if (e.key.code == sf::Keyboard::T)
                    showForces = !showForces;
            }
        }

        float I = 0.5f * pulleyMass * pulleyRadius * pulleyRadius;

        float accel =
            (m1 - m2) * g /
            (m1 + m2 + I / (pulleyRadius * pulleyRadius));

        float T1 = m1 * (g - accel);
        float T2 = m2 * (g + accel);

        float pulleyY = pulley.getPosition().y;
        float screenBottom = HEIGHT + 100;

        if (!paused)
        {
            velocity += accel * dt;

            y1 += velocity * dt * 200;
            y2 = ropeLength - y1;

            if (y1 <= pulleyY)
            {
                y1 = pulleyY;
                y2 = ropeLength - y1;
                velocity = 0;
            }

            if (y2 <= pulleyY)
            {
                y2 = pulleyY;
                y1 = ropeLength - y2;
                velocity = 0;
            }

            if (y1 > screenBottom && y2 > screenBottom)
            {
                y1 = screenBottom;
                y2 = ropeLength - y1;
                velocity = 0;
            }

            angle += (velocity / pulleyRadius) * dt * 180;
            time += dt;
        }

        pulley.setRotation(angle);

        float leftX = pulley.getPosition().x - pulleyRadius;
        float rightX = pulley.getPosition().x + pulleyRadius;

        float mass1X = leftX - 45;
        float mass2X = rightX - 45;

        mass1.setPosition(mass1X, y1);
        mass2.setPosition(mass2X, y2);

        float KE = 0.5f * (m1 + m2) * velocity * velocity;
        float PE = m1 * g * y1 + m2 * g * y2;

        window.clear(sf::Color(10, 10, 20));

        for (int y = 0; y < HEIGHT; y += 50)
        {
            sf::Vertex line[] =
            {
                sf::Vertex(sf::Vector2f(0,y),sf::Color(30,30,40)),
                sf::Vertex(sf::Vector2f(WIDTH,y),sf::Color(30,30,40))
            };

            window.draw(line, 2, sf::Lines);
        }

        window.draw(pulley);

        sf::RectangleShape spoke(sf::Vector2f(pulleyRadius, 2));
        spoke.setOrigin(0, 1);
        spoke.setPosition(pulley.getPosition());

        for (int i = 0; i < 8; i++)
        {
            spoke.setRotation(angle + i * 45);
            window.draw(spoke);
        }

        window.draw(mass1);
        window.draw(mass2);

        float pulleyYpos = pulley.getPosition().y;

        sf::Vertex ropeLeft[] =
        {
            sf::Vertex({leftX,pulleyYpos},sf::Color::White),
            sf::Vertex({leftX,y1},sf::Color::White)
        };

        sf::Vertex ropeRight[] =
        {
            sf::Vertex({rightX,pulleyYpos},sf::Color::White),
            sf::Vertex({rightX,y2},sf::Color::White)
        };

        window.draw(ropeLeft, 2, sf::Lines);
        window.draw(ropeRight, 2, sf::Lines);

        sf::VertexArray ropeArc(sf::LineStrip, 40);

        for (int i = 0; i < 40; i++)
        {
            float t = 3.14159f + i * (3.14159f / 39);

            ropeArc[i].position =
            {
                pulley.getPosition().x + cos(t) * pulleyRadius,
                pulley.getPosition().y + sin(t) * pulleyRadius
            };

            ropeArc[i].color = sf::Color::White;
        }

        window.draw(ropeArc);

        if (showForces)
        {
            drawArrow(window, { leftX,y1 }, { leftX,y1 + 80 }, sf::Color::Red);
            drawArrow(window, { rightX,y2 }, { rightX,y2 + 80 }, sf::Color::Red);

            drawArrow(window, { leftX,y1 }, { leftX,y1 - 80 }, sf::Color::Green);
            drawArrow(window, { rightX,y2 }, { rightX,y2 - 80 }, sf::Color::Green);
        }

        if (fontLoaded)
        {
            panel.setPosition(20, 20);

            panel.setString(
                "ADVANCED ATWOOD MACHINE\n\n"
                "Mass1 = " + formatFloat(m1) + " kg\n"
                "Mass2 = " + formatFloat(m2) + " kg\n"
                "Gravity = " + formatFloat(g) + "\n\n"
                "Acceleration = " + formatFloat(accel) + "\n"
                "Velocity = " + formatFloat(velocity) + "\n"
                "T1 = " + formatFloat(T1) + "\n"
                "T2 = " + formatFloat(T2) + "\n"
                "Time = " + formatFloat(time) + "\n\n"
                "Energy\n"
                "KE = " + formatFloat(KE) + "\n"
                "PE = " + formatFloat(PE) + "\n\n"
                "Controls\n"
                "Q/A : Mass1 +/-\n"
                "W/S : Mass2 +/-\n"
                "G/H : Gravity +/-\n"
                "SPACE : Pause\n"
                "R : Reset\n"
                "T : Toggle Forces"
            );

            window.draw(panel);
        }

        window.display();
    }
}
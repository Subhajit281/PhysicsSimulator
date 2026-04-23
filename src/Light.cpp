#include "Light.h"
#include <iostream>
#include <cmath>
#include <sstream>

using namespace std;

/* Utility */

string Light::toStr(float v)
{
    stringstream ss;
    ss << v;
    return ss.str();
}

void Light::DrawAxis(sf::RenderWindow& window, float axisY)
{
    sf::Vertex axis[] =
    {
        sf::Vertex(sf::Vector2f(0,axisY),sf::Color::White),
        sf::Vertex(sf::Vector2f(1400,axisY),sf::Color::White)
    };

    window.draw(axis, 2, sf::Lines);
}

void Light::DrawObject(sf::RenderWindow& window, float x, float axisY, float height)
{
    sf::RectangleShape object(sf::Vector2f(6, height));

    object.setPosition(x, axisY - height);
    object.setFillColor(sf::Color::Green);

    window.draw(object);
}

void Light::DrawImage(sf::RenderWindow& window, float x, float axisY, float height)
{
    sf::RectangleShape image(sf::Vector2f(6, abs(height)));

    if (height < 0)
        image.setPosition(x, axisY);
    else
        image.setPosition(x, axisY - height);

    image.setFillColor(sf::Color::Red);

    window.draw(image);
}

void Light::DrawFocus(sf::RenderWindow& window, float x, float axisY, sf::Color color)
{
    sf::CircleShape p(6);

    p.setPosition(x, axisY - 6);
    p.setFillColor(color);

    window.draw(p);
}

/* Plane Mirror */

void Light::RunPlaneMirrorSimulation()
{
    sf::RenderWindow window(sf::VideoMode(1100, 700), "Plane Mirror");

    float mirrorX = 700;
    float axisY = 350;

    float objectX = 250;
    float objectHeight = 120;

    while (window.isOpen())
    {
        sf::Event event;

        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();

            if (event.type == sf::Event::KeyPressed)
            {
                if (event.key.code == sf::Keyboard::Left)
                    objectX -= 10;

                if (event.key.code == sf::Keyboard::Right)
                    objectX += 10;
            }
        }

        float u = mirrorX - objectX;
        float v = u;

        float imageX = mirrorX + v;

        window.clear(sf::Color::Black);

        DrawAxis(window, axisY);

        sf::RectangleShape mirror(sf::Vector2f(6, 300));
        mirror.setPosition(mirrorX, axisY - 150);
        mirror.setFillColor(sf::Color::Cyan);

        window.draw(mirror);

        DrawObject(window, objectX, axisY, objectHeight);
        DrawImage(window, imageX, axisY, objectHeight);

        window.display();
    }
}

/* Concave Mirror */

void Light::RunConcaveMirrorSimulation()
{
    sf::RenderWindow window(sf::VideoMode(1400, 800), "Concave Mirror");

    float mirrorX = 950;
    float axisY = 400;

    float focalLength = 200;

    float objectX = 250;
    float objectHeight = 120;

    while (window.isOpen())
    {
        sf::Event event;

        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();

            if (event.type == sf::Event::KeyPressed)
            {
                if (event.key.code == sf::Keyboard::Left)
                    objectX -= 10;

                if (event.key.code == sf::Keyboard::Right)
                    objectX += 10;

                if (event.key.code == sf::Keyboard::Up)
                    focalLength += 10;

                if (event.key.code == sf::Keyboard::Down)
                    focalLength -= 10;
            }
        }

        float u = mirrorX - objectX;

        float v = (u * focalLength) / (u - focalLength);

        float magnification = -v / u;

        float imageHeight = objectHeight * magnification;

        float imageX = mirrorX - v;

        window.clear(sf::Color(10, 10, 30));

        DrawAxis(window, axisY);

        sf::CircleShape mirror(500, 200);

        mirror.setPosition(mirrorX - 500, axisY - 500);
        mirror.setOutlineColor(sf::Color::Cyan);
        mirror.setOutlineThickness(3);
        mirror.setFillColor(sf::Color::Transparent);

        window.draw(mirror);

        DrawObject(window, objectX, axisY, objectHeight);
        DrawImage(window, imageX, axisY, imageHeight);

        float focusX = mirrorX - focalLength;
        float centerX = mirrorX - 2 * focalLength;

        DrawFocus(window, focusX, axisY, sf::Color::Yellow);
        DrawFocus(window, centerX, axisY, sf::Color::Magenta);

        window.display();
    }
}

/* Convex Mirror */

void Light::RunConvexMirrorSimulation()
{
    sf::RenderWindow window(sf::VideoMode(1400, 800), "Convex Mirror");

    float mirrorX = 950;
    float axisY = 400;

    float focalLength = -200;

    float objectX = 250;
    float objectHeight = 120;

    while (window.isOpen())
    {
        sf::Event event;

        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();

            if (event.type == sf::Event::KeyPressed)
            {
                if (event.key.code == sf::Keyboard::Left)
                    objectX -= 10;

                if (event.key.code == sf::Keyboard::Right)
                    objectX += 10;
            }
        }

        float u = mirrorX - objectX;

        float v = (u * focalLength) / (u - focalLength);

        float magnification = -v / u;

        float imageHeight = objectHeight * magnification;

        float imageX = mirrorX + abs(v);

        window.clear(sf::Color(15, 10, 30));

        DrawAxis(window, axisY);

        sf::CircleShape mirror(500, 200);

        mirror.setPosition(mirrorX, axisY - 500);
        mirror.setOutlineColor(sf::Color::Cyan);
        mirror.setOutlineThickness(3);
        mirror.setFillColor(sf::Color::Transparent);

        window.draw(mirror);

        DrawObject(window, objectX, axisY, objectHeight);
        DrawImage(window, imageX, axisY, imageHeight);

        float focusX = mirrorX + abs(focalLength);

        DrawFocus(window, focusX, axisY, sf::Color::Yellow);

        window.display();
    }
}

/* Entry Function */

void Light::run()
{
    int choice;

    cout << "\n====== OPTICS SIMULATOR ======\n";
    cout << "1 Plane Mirror\n";
    cout << "2 Concave Mirror\n";
    cout << "3 Convex Mirror\n";
    cout << "4 Exit\n";

    cout << "Choice: ";
    cin >> choice;

    if (choice == 1)
        RunPlaneMirrorSimulation();

    else if (choice == 2)
        RunConcaveMirrorSimulation();

    else if (choice == 3)
        RunConvexMirrorSimulation();
}
#include "Wave.h"
#include <SFML/Graphics.hpp>
#include <cmath>
#include <sstream>
#include <vector>

using namespace std;

// -------- SOURCE STRUCT --------
struct Source
{
    sf::Vector2f position;
};

// -------- MAIN FUNCTION --------
void Wave::run()
{
    const int WIDTH = 1200;
    const int HEIGHT = 800;

    sf::RenderWindow window(sf::VideoMode(WIDTH, HEIGHT), "Hyper Realistic Wave Lab");
    window.setFramerateLimit(60);

    vector<Source> sources;

    sf::Image image;
    image.create(WIDTH, HEIGHT, sf::Color::Black);

    sf::Texture texture;
    sf::Sprite sprite;

    float time = 0.0f;

    float amplitude = 2.0f;
    float frequency = 3.0f;
    float waveSpeed = 0.04f;
    float damping = 0.002f;

    bool paused = false;

    // -------- CAMERA --------
    sf::View view(sf::FloatRect(0, 0, WIDTH, HEIGHT));

    // -------- FONT --------
    sf::Font font;
    font.loadFromFile("C:/Windows/Fonts/arial.ttf");

    sf::Text info;
    info.setFont(font);
    info.setCharacterSize(16);
    info.setFillColor(sf::Color::White);

    while (window.isOpen())
    {
        sf::Event event;

        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();

            // -------- ADD SOURCE --------
            if (event.type == sf::Event::MouseButtonPressed)
            {
                if (event.mouseButton.button == sf::Mouse::Left)
                {
                    Source s;
                    s.position = window.mapPixelToCoords(
                        sf::Vector2i(event.mouseButton.x, event.mouseButton.y)
                    );
                    sources.push_back(s);
                }
            }

            // -------- CONTROLS --------
            if (event.type == sf::Event::KeyPressed)
            {
                if (event.key.code == sf::Keyboard::C) sources.clear();
                if (event.key.code == sf::Keyboard::Space) paused = !paused;

                if (event.key.code == sf::Keyboard::Q) amplitude += 0.2f;
                if (event.key.code == sf::Keyboard::A) amplitude -= 0.2f;

                if (event.key.code == sf::Keyboard::W) frequency += 0.3f;
                if (event.key.code == sf::Keyboard::S) frequency -= 0.3f;

                if (event.key.code == sf::Keyboard::E) waveSpeed += 0.005f;
                if (event.key.code == sf::Keyboard::D) waveSpeed -= 0.005f;

                if (event.key.code == sf::Keyboard::R) damping += 0.0005f;
                if (event.key.code == sf::Keyboard::F) damping -= 0.0005f;
            }
        }

        // -------- CAMERA MOVEMENT --------
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Up)) view.move(0, -5);
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Down)) view.move(0, 5);
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left)) view.move(-5, 0);
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Right)) view.move(5, 0);

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Z)) view.zoom(0.98f);
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::X)) view.zoom(1.02f);

        window.setView(view);

        if (!paused)
            time += 0.03f;

        // -------- WAVE RENDER --------
        for (int x = 0; x < WIDTH; x++)
        {
            for (int y = 0; y < HEIGHT; y++)
            {
                float wave = 0.0f;

                for (auto& s : sources)
                {
                    float dx = x - s.position.x;
                    float dy = y - s.position.y;

                    float dist = sqrt(dx * dx + dy * dy);

                    // REALISTIC ATTENUATION
                    float attenuation = exp(-damping * dist);

                    // REALISTIC WAVE EQUATION
                    wave += amplitude *
                        sin(dist * waveSpeed - time * frequency) *
                        attenuation;
                }

                // -------- COLOR MAPPING --------
                float normalized = (wave + 5.0f) / 10.0f;

                if (normalized < 0) normalized = 0;
                if (normalized > 1) normalized = 1;

                sf::Uint8 r = (sf::Uint8)(255 * normalized);
                sf::Uint8 g = (sf::Uint8)(255 * (1 - fabs(normalized - 0.5f) * 2));
                sf::Uint8 b = (sf::Uint8)(255 * (1 - normalized));

                image.setPixel(x, y, sf::Color(r, g, b));
            }
        }

        texture.loadFromImage(image);
        sprite.setTexture(texture);

        window.clear();
        window.draw(sprite);

        // -------- DRAW SOURCES --------
        for (auto& s : sources)
        {
            sf::CircleShape marker(6);
            marker.setFillColor(sf::Color::White);
            marker.setOrigin(6, 6);
            marker.setPosition(s.position);
            window.draw(marker);
        }

        // -------- UI TEXT --------
        stringstream ss;

        ss << "HYPER REALISTIC WAVE LAB\n\n";
        ss << "Sources: " << sources.size() << "\n";
        ss << "Amplitude: " << amplitude << "\n";
        ss << "Frequency: " << frequency << "\n";
        ss << "Wave Speed: " << waveSpeed << "\n";
        ss << "Damping: " << damping << "\n";
        ss << "Time: " << time << "\n\n";

        ss << "Controls\n";
        ss << "Click : Add Source\n";
        ss << "C : Clear\n";
        ss << "SPACE : Pause\n";
        ss << "Q/A : Amplitude\n";
        ss << "W/S : Frequency\n";
        ss << "E/D : Speed\n";
        ss << "R/F : Damping\n";
        ss << "Arrows : Move Camera\n";
        ss << "Z/X : Zoom\n";

        info.setString(ss.str());
        info.setPosition(view.getCenter().x - WIDTH / 2 + 10,
            view.getCenter().y - HEIGHT / 2 + 10);

        window.draw(info);
        window.display();
    }
}
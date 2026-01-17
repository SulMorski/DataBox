'use client';

import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username || !email || !password || !confirmPassword) {
            setError('Wszystkie pola są wymagane.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Hasła nie są takie same.');
            return;
        }

        try {
            const res = await fetch('https://localhost:7218/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (res.status === 409) {
                setError('Email już istnieje.');
            } else if (!res.ok) {
                setError('Błąd rejestracji.');
            } else {
                const data = await res.json();
                console.log('Zarejestrowano:', data);

                setSuccess('Zarejestrowano');
                setError('');

                setTimeout(() => {
                    router.push('/login'); // Przekierowanie po rejestracji
                }, 1500);
            }
        } catch (err) {
            console.error(err);
            setError('Błąd połączenia z serwerem.');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="p-4 shadow-sm">
                        <h2 className="text-center mb-4">DataBox Rejestracja</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formUsername" className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Wpisz username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Wpisz email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Label>Hasło</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Hasło"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formConfirmPassword" className="mb-3">
                                <Form.Label>Potwierdź Hasło</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Potwierdź hasło"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-2">
                                Zarejestruj
                            </Button>

                            <Link href="/login" passHref>
                                <Button variant="secondary" className="w-100">
                                    Powrót do logowania
                                </Button>
                            </Link>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
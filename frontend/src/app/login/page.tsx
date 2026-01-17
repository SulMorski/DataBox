'use client';

import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import {useRouter} from 'next/navigation';
import Link from "next/dist/client/link";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Wszystkie pola są wymagane.');
            return;
        }

        try {
            const res = await fetch('https://localhost:7218/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError('Niepoprawny email lub hasło.');
            } else {
                setError('');
                if(rememberMe){
                    localStorage.setItem('userId', data.id);
                    localStorage.setItem('username', data.username);
                }
                else{
                    sessionStorage.setItem('userId', data.id);
                    sessionStorage.setItem('username', data.username);
                }


                // przekierowanie do main
                router.push('/main');
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
                        <h2 className="text-center mb-4">DataBox Login</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
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

                            <Form.Group controlId="formRemember" className="mb-3">
                                <Form.Check type="checkbox" label="Pamiętaj mnie" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}/>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-2">
                                Zaloguj
                            </Button>

                            {/* przycisk rejestracji */}
                            <Link href="/register" passHref>
                                <Button variant="secondary" className="w-100">
                                    Rejestracja
                                </Button>
                            </Link>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
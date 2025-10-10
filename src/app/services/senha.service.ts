import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, query, orderBy, where, limit, getDocs, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Senha {
  id?: string;
  codigo: string;
  tipo: 'normal' | 'preferencial';
  status: 'aguardando' | 'chamada' | 'atendida';
  hora: string;
}

@Injectable({ providedIn: 'root' })
export class SenhaService {
  private senhasRef;

  constructor(private firestore: Firestore) {
    this.senhasRef = collection(this.firestore, 'senhas');
  }

  // Gera uma nova senha e retorna ela com ID
  async gerarSenha(tipo: 'normal' | 'preferencial'): Promise<Senha> {
    const prefixo = tipo === 'preferencial' ? 'P' : 'N';
    const codigo = prefixo + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const hora = new Date().toLocaleTimeString();

    const docRef: DocumentReference = await addDoc(this.senhasRef, { tipo, codigo, status: 'aguardando', hora });

    return {
      id: docRef.id,
      codigo,
      tipo,
      status: 'aguardando',
      hora
    };
  }

  // Lista senhas que estão aguardando
  listarSenhasAguardando(): Observable<Senha[]> {
    const q = query(this.senhasRef, where('status', '==', 'aguardando'), orderBy('hora'));
    return collectionData(q, { idField: 'id' }) as Observable<Senha[]>;
  }

  // Lista senhas que foram chamadas
  listarSenhasChamadas(): Observable<Senha[]> {
    const q = query(this.senhasRef, where('status', '==', 'chamada'), orderBy('hora'));
    return collectionData(q, { idField: 'id' }) as Observable<Senha[]>;
  }

  // 🆕 MÉTODO ADICIONADO: Lista as últimas senhas chamadas (para o Painel de TV)
  listarUltimasChamadas(limite: number = 5): Observable<Senha[]> {
    // Ordena pela hora de forma descendente ('desc') para que a mais recente venha primeiro
    const q = query(
        this.senhasRef,
        where('status', '==', 'chamada'),
        orderBy('hora', 'desc'),
        limit(limite)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Senha[]>;
  }

  // Pega a próxima senha a ser chamada
  async proximaSenha(): Promise<Senha | null> {
    const q = query(this.senhasRef, where('status', '==', 'aguardando'), orderBy('hora'), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docData = snapshot.docs[0].data() as Senha;
    const docId = snapshot.docs[0].id;

    return { ...docData, id: docId };
  }

  // Atualiza status da senha
  async atualizarStatus(senhaId: string, status: 'chamada' | 'atendida') {
    const senhaDoc = doc(this.firestore, `senhas/${senhaId}`);
    await updateDoc(senhaDoc, { status });
  }
}

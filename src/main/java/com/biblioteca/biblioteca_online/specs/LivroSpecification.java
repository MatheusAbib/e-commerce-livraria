package com.biblioteca.biblioteca_online.specs;

import com.biblioteca.biblioteca_online.model.Livro;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class LivroSpecification {

    public static Specification<Livro> tituloContem(String titulo) {
        return (root, query, cb) -> {
            if (titulo == null || titulo.isEmpty()) return cb.conjunction();
            return cb.like(cb.lower(root.get("titulo")), "%" + titulo.toLowerCase() + "%");
        };
    }

    public static Specification<Livro> autorContem(String autor) {
        return (root, query, cb) -> {
            if (autor == null || autor.isEmpty()) return cb.conjunction();
            return cb.like(cb.lower(root.get("autor")), "%" + autor.toLowerCase() + "%");
        };
    }

    public static Specification<Livro> editoraContem(String editora) {
        return (root, query, cb) -> {
            if (editora == null || editora.isEmpty()) return cb.conjunction();
            return cb.like(cb.lower(root.get("editora")), "%" + editora.toLowerCase() + "%");
        };
    }

    public static Specification<Livro> categoriaContem(String categoria) {
        return (root, query, cb) -> {
            if (categoria == null || categoria.isEmpty()) return cb.conjunction();
            return cb.like(cb.lower(root.get("categoria")), "%" + categoria.toLowerCase() + "%");
        };
    }

    public static Specification<Livro> isbnContem(String isbn) {
        return (root, query, cb) -> {
            if (isbn == null || isbn.isEmpty()) return cb.conjunction();
            return cb.like(cb.lower(root.get("isbn")), "%" + isbn.toLowerCase() + "%");
        };
    }

    public static Specification<Livro> precoVendaEntre(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return cb.conjunction();
            if (min != null && max != null) return cb.between(root.get("precoVenda"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("precoVenda"), min);
            return cb.lessThanOrEqualTo(root.get("precoVenda"), max);
        };
    }

    public static Specification<Livro> estoqueEntre(Integer min, Integer max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return cb.conjunction();
            if (min != null && max != null) return cb.between(root.get("estoque"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("estoque"), min);
            return cb.lessThanOrEqualTo(root.get("estoque"), max);
        };
    }

    public static Specification<Livro> statusIgual(String status) {
        return (root, query, cb) -> {
            if (status == null || status.isEmpty()) return cb.conjunction();
            if ("ativo".equalsIgnoreCase(status)) {
                return cb.isTrue(root.get("ativo"));
            } else if ("inativo".equalsIgnoreCase(status)) {
                return cb.isFalse(root.get("ativo"));
            }
            return cb.conjunction();
        };
    }
}
